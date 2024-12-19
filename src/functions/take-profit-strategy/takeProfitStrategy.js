import WebSocket from "ws";
import { placeOrder } from "../../routes/placeOrder.js";
import dotenv from "dotenv";
import { getPosition } from "../socket/getPosition.js";
import { getAIDecision } from "../get/startPosition/getAIDecision.js";
import { Connection } from "../../db/models/connection.js";
dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const REFRESH_INTERVAL = 100000; // פרק זמן לרענון המידע מה-API. כאן 60 שניות לדוגמה.

export const takeProfitStrategy = (
  symbol,
  category,
  roiTarget,
  qtyToSell,
  debounceTime = 50000
) => {
  console.log(`Starting Take Profit Strategy for ${symbol}...`);
  const wsUrl = "wss://stream.bybit.com/v5/public/linear"; // שנה ל-'inverse' אם נדרש
  const ws = new WebSocket(wsUrl);

  let isBusy = false;
  let lastAIDecisionTime = 0;

  // משתנים לאחסון מידע על הפוזיציה כדי לא לקרוא ל-getPosition כל הזמן
  let positionSize = 0;
  let avgPrice = 0;
  let lastPositionUpdate = 0; // זמן אחרון בו רעננו את המידע
  let unrealisedPnl = 0;
  const updatePositionData = async () => {
    try {
      const position = await getPosition(symbol);
      if (!position) {
        console.log(`No active position found for symbol: ${symbol}`);
        return false;
      }
      positionSize = parseFloat(position.size);
      avgPrice = parseFloat(position.avgPrice);
      unrealisedPnl = parseFloat(position.unrealisedPnl);
      lastPositionUpdate = Date.now();
      return true;
    } catch (error) {
      console.error("Error getting position:", error.message);
      return false;
    }
  };

  ws.on("open", async () => {
    console.log(`WebSocket connected to ${wsUrl} for Take Profit Strategy.`);
    ws.send(JSON.stringify({ op: "subscribe", args: [`tickers.${symbol}`] }));

    // ניסיון ראשון לקבלת פרטי הפוזיציה בתחילת הריצה
    const success = await updatePositionData();
    if (!success) {
      console.log(
        "Could not retrieve initial position data. Strategy will not proceed without position data."
      );
    }
  });

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.topic && data.topic.startsWith("tickers") && data.data) {
        const markPrice = parseFloat(data.data.lastPrice || 0);
        if (!isNaN(markPrice) && markPrice > 0) {
          const now = Date.now();
          // נבדוק אם עבר מספיק זמן מאז העדכון האחרון - אם כן, נעדכן את המידע
          if (now - lastPositionUpdate > REFRESH_INTERVAL) {
            const updated = await updatePositionData();
            if (!updated) {
              console.log(
                "Skipping calculations as position data is unavailable."
              );
              return;
            }
          }

          // אם אין לנו avgPrice תקין, לא נוכל לחשב ROI
          if (!avgPrice || avgPrice <= 0 || positionSize <= 0) {
            console.log(
              `No valid position data for ${symbol}. Skipping ROI calculation.`
            );
            return;
          }

          const roi = ((markPrice - avgPrice) / avgPrice) * 100;
          console.log(
            `Take Profit Strategy | Symbol: ${symbol} | Current Price: ${markPrice} | ROI: ${roi.toFixed(
              3
            )}% | Avg Entry Price: ${avgPrice}`
          );

          if (roi >= roiTarget && !isBusy) {
            if (now - lastAIDecisionTime > debounceTime) {
              isBusy = true;
              console.log(
                `ROI target met (${roi.toFixed(
                  3
                )}%). Consulting AI for decision...`
              );

              try {
                const payload = {
                  symbol,
                  markPrice,
                  roi,
                  avgPrice,
                  positionSize,
                };
                const decision = await getAIDecision(
                  symbol,
                  markPrice,
                  roi,
                  avgPrice,
                  positionSize
                );
                // הסרנו את return וההערות פה כדי שהקוד ימשיך
                // console.log(`AI Decision: ${decision.decision}`);
                // console.log(decision, payload);
                if (decision.toLowerCase() === "sell") {
                  console.log(
                    `Executing sell order for ${qtyToSell} of ${symbol}...`
                  );
                  const orderResponse = await placeOrder(
                    symbol,
                    "Sell",
                    qtyToSell,
                    null,
                    `linear`
                  );
                  // console.log("Sell Order Response:", orderResponse);
                  // לאחר ביצוע פעולה אפשר לרצות לעדכן שוב את הפוזיציה
                  await updatePositionData();

                  let connection = await Connection.findOne({ symbol });
                  if (connection.buyCount >= 2) {
                    connection.buyCount = connection.buyCount - 1;
                    connection.save();
                  }
                } else {
                  console.log("AI decided not to sell.");
                }

                lastAIDecisionTime = now;
              } catch (error) {
                console.error("Error during AI decision:", error.message);
              } finally {
                isBusy = false;
              }

              // המתנה נוספת כדי למנוע קריאות חוזרות ל-AI
              await delay(debounceTime);
            } else {
              console.log("Debounce active. Skipping AI consultation.");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error.message);
    }
  });

  ws.on("error", (error) => console.error(`WebSocket error: ${error.message}`));

  ws.on("close", async () => {
    console.log(`WebSocket for Take Profit Strategy on ${symbol} closed.`);
    setTimeout(() => {
      connectWebSocket(
        symbol,
        category,
        roiTarget,
        qtyToSell,
        (debounceTime = 50000)
      );
    }, 5000); // התחבר מחדש לאחר 5 שניות
  });
};
