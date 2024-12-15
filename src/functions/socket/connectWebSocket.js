import WebSocket from "ws";
import { placeOrder } from "../place-order/placeOrder.js";

export const connectWebSocket = (
  symbol,
  side,
  quantity,
  stepPercentage,
  debounceTime = 5000
) => {
  console.log(`Connecting WebSocket for ${symbol}...`);

  const wsUrl = "wss://stream.bybit.com/v5/public/linear";
  const ws = new WebSocket(wsUrl);

  let initialPrice = null;
  let currentROI = 0;
  let lastOrderTime = 0;

  ws.on("open", () => {
    console.log(`WebSocket connected to ${wsUrl}`);

    const subscribePayload = {
      op: "subscribe",
      args: [`tickers.${symbol}`],
    };
    ws.send(JSON.stringify(subscribePayload));
  });

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      // בדיקה שהמבנה של ההודעה תואם למה שנדרש
      if (
        data.topic &&
        data.topic.startsWith("tickers") &&
        data.data &&
        Array.isArray(data.data) &&
        data.data[0] &&
        data.data[0].lastPrice
      ) {
        const tickerData = data.data[0];
        const lastPrice = parseFloat(tickerData.lastPrice);

        if (!isNaN(lastPrice)) {
          await processPrice(
            lastPrice,
            symbol,
            side,
            quantity,
            stepPercentage,
            debounceTime
          );
        } else {
          console.warn(`Invalid lastPrice: ${tickerData.lastPrice}`);
        }
      } else {
        console.warn("Unexpected WebSocket message format:", data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error.message);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });

  ws.on("close", () => {
    console.log(`WebSocket for ${symbol} closed.`);
  });

  const processPrice = async (
    currentPrice,
    symbol,
    side,
    quantity,
    stepPercentage,
    debounceTime
  ) => {
    if (!initialPrice) {
      initialPrice = currentPrice;
      console.log(`Initial price set to ${initialPrice}`);
      return;
    }

    currentROI = ((currentPrice - initialPrice) / initialPrice) * 100;

    console.log(
      `Currency: ${symbol} Current price: ${currentPrice}, ROI: ${currentROI.toFixed(
        2
      )}%`
    );

    const now = Date.now();
    if (
      Math.abs(currentROI) >= stepPercentage &&
      now - lastOrderTime >= debounceTime
    ) {
      console.log(
        `ROI changed by ${stepPercentage}% - placing additional order.`
      );
      const orderResponse = await placeOrder(symbol, side, quantity);

      if (orderResponse && orderResponse.retCode === 0) {
        console.log("Order placed successfully. Resetting ROI...");
        initialPrice = currentPrice; // איפוס המחיר הראשוני
        currentROI = 0; // איפוס ROI
        lastOrderTime = now; // עדכון זמן ההזמנה האחרונה
      } else {
        console.warn("Order failed. Retrying on next ROI update.");
      }
    }
  };
};
