import WebSocket from "ws";
import { processPrice } from "./proccessPrice.js";
import { Connection } from "../../db/models/connection.js";

export const connectWebSocket = async (
  symbol,
  side,
  quantity,
  stepPercentage,
  roiTakeProfit,
  roiBuyThreshold = null,
  round,
  aiThreshold,
  debounceTime
) => {
  console.log(`Connecting WebSocket for ${symbol}...`);
  const wsUrl = "wss://stream.bybit.com/v5/public/linear";

  const ws = new WebSocket(wsUrl);
  let connection = await Connection.findOne({ symbol });
  if (!connection) {
    connection = new Connection({ symbol, initialPrice: null, buyCount: 0 });
    await connection.save();
  }
  let { initialPrice, isBusy } = connection;

  let lastDatabaseCheckTime = 0; // זמן הבדיקה האחרון מה-Database
  const databaseCheckInterval = 0.5 * 60 * 1000; // בדיקה כל 5 דקות (במילישניות)

  const percentageThreshold = 0.3; // סף אחוזים להבדל
  let lastOrderTime = 0;
  const incrementPercent = 150; // אחוז ההגדלה (1.5%) בכל קנייה חוזרת

  async function getBuyQuantity(initialQty, round = true) {
    let updatedConnection = await Connection.findOne({ symbol });
    let { buyCount } = updatedConnection;
    let updatedQuantity;
    if (buyCount < 1) {
      updatedQuantity = initialQty;
    } else {
      updatedQuantity = initialQty * (buyCount * 2); // buyCount + 1 כדי להכפיל לפי הסדר הנכון
    }

    updatedConnection.buyCount = updatedConnection.buyCount + 1;
    await updatedConnection.save();

    return round ? Math.ceil(updatedQuantity) : updatedQuantity;
  }

  ws.on("open", () => {
    console.log(`WebSocket connected to ${wsUrl}`);
    ws.send(JSON.stringify({ op: "subscribe", args: [`tickers.${symbol}`] }));
  });

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.topic && data.topic.startsWith("tickers") && data.data) {
        const lastPrice = parseFloat(data.data.lastPrice || 0);
        if (!isNaN(lastPrice) && lastPrice > 0) {
          if (initialPrice === null) {
            initialPrice = lastPrice;
            connection.initialPrice = initialPrice;
            await connection.save();
            console.log(`Initial price set to ${initialPrice}`);
          }

          const now = Date.now();

          // בדוק אם יש צורך לבדוק עדכונים ב-Database
          if (now - lastDatabaseCheckTime > databaseCheckInterval) {
            const updatedConnection = await Connection.findOne({ symbol });
            if (
              updatedConnection &&
              updatedConnection.initialPrice !== initialPrice
            ) {
              initialPrice = updatedConnection.initialPrice;
              console.log(
                `Initial price updated to ${symbol} from database: ${initialPrice}`
              );
            } else {
              // console.log(`Successfully updated`);
            }
            lastDatabaseCheckTime = now; // עדכון זמן הבדיקה האחרון
          }

          if (initialPrice === null) {
            initialPrice = lastPrice;
            connection.initialPrice = initialPrice;
            await connection.save();
            console.log(`Initial price set to ${initialPrice}`);
          }

          if (connection.lastPrice) {
            // חישוב ההבדל באחוזים בין המחירים
            const priceDifferencePercentage =
              Math.abs(
                (lastPrice - connection.lastPrice) / connection.lastPrice
              ) * 100;

            // שמירת המחיר רק אם ההבדל גדול מסף האחוזים
            if (priceDifferencePercentage > percentageThreshold) {
              connection.lastPrice = lastPrice;
              await connection.save();
              console.log(
                `Saved new price: ${lastPrice} | Change: ${priceDifferencePercentage.toFixed(
                  2
                )}%`
              );
            } else {
              // console.log(
              //   `Price difference (${priceDifferencePercentage.toFixed(
              //     2
              //   )}%) below threshold. Not saving.`
              // );
            }
          } else {
            // אם אין lastPrice שמור, נשמור את המחיר הנוכחי
            connection.lastPrice = lastPrice;
            await connection.save();
            console.log(`${symbol} Saved last price: ${lastPrice}`);
          }
          await processPrice(
            lastPrice,
            symbol,
            side,
            quantity,
            stepPercentage,
            roiTakeProfit,
            roiBuyThreshold,
            null,
            aiThreshold, // נשאיר את aiThreshold כאן
            debounceTime,
            initialPrice,
            async (newPrice) => {
              initialPrice = newPrice;
              connection.initialPrice = initialPrice;
              await connection.save();
              console.log(`Initial price set to ${initialPrice}`);
            },
            () => isBusy,
            async (state) => {
              isBusy = state;
              console.log(`isBusy set to: ${state}`);
            },
            () => lastOrderTime,
            (time) => {
              lastOrderTime = time;
              console.log(`Last order time updated to: ${time}`);
            },
            getBuyQuantity
          );
        }
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error.message);
    }
  });

  ws.on("error", (error) => console.error(`WebSocket error: ${error.message}`));
  ws.on("close", async () => {
    console.log(`WebSocket for ${symbol} closed.`);
    connection.isBusy = false;
    await connection.save();
    setTimeout(() => {
      connectWebSocket(
        symbol,
        side,
        quantity,
        stepPercentage,
        roiTakeProfit,
        roiBuyThreshold,
        round,
        aiThreshold,
        debounceTime
      );
    }, 5000); // התחבר מחדש לאחר 5 שניות
  });
};
