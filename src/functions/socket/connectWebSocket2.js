import WebSocket from "ws";
import { placeOrder } from "../place-order/placeOrder.js";
import { getMinOrderSize } from "../place-order/getMinOrderSize.js";

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

  let maxPriceSinceOrder = null; // המחיר הגבוה ביותר מאז ההזמנה האחרונה
  let minPriceSinceOrder = null; // המחיר הנמוך ביותר מאז ההזמנה האחרונה
  let lastOrderTime = 0;
  let isBusy = false; // למנוע הזמנות כפולות

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

      if (data.topic && data.topic.startsWith("tickers") && data.data) {
        const tickerData = data.data;

        if (tickerData.lastPrice) {
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
        }
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
    if (maxPriceSinceOrder === null || minPriceSinceOrder === null) {
      maxPriceSinceOrder = currentPrice;
      minPriceSinceOrder = currentPrice;
      console.log(
        `Initial price tracking set: max=${maxPriceSinceOrder}, min=${minPriceSinceOrder}`
      );
      return;
    }

    const percentageChangeUp =
      ((currentPrice - maxPriceSinceOrder) / maxPriceSinceOrder) * 100;
    const percentageChangeDown =
      ((minPriceSinceOrder - currentPrice) / minPriceSinceOrder) * 100;

    console.log(
      `Currency: ${symbol}, Current price: ${currentPrice}, MaxPrice: ${maxPriceSinceOrder}, MinPrice: ${minPriceSinceOrder}, UpChange: ${percentageChangeUp.toFixed(
        2
      )}%, DownChange: ${percentageChangeDown.toFixed(2)}%`
    );

    const now = Date.now();

    // תנאי להזמנה בעקבות עלייה
    if (
      percentageChangeUp >= stepPercentage &&
      now - lastOrderTime >= debounceTime &&
      !isBusy
    ) {
      console.log(
        `Price increased by ${stepPercentage}%. Placing order for upward trend.`
      );
      isBusy = true;

      const minOrderSize = await getMinOrderSize(symbol);
      if (quantity < minOrderSize) {
        console.error(
          `Quantity ${quantity} is less than the minimum order size ${minOrderSize} for ${symbol}. Skipping.`
        );
        isBusy = false;
        return;
      }

      const orderResponse = await placeOrder(symbol, side, quantity);

      if (orderResponse && orderResponse.retCode === 0) {
        console.log(
          "Order placed successfully on increase. Updating max price..."
        );
        maxPriceSinceOrder = currentPrice;
        lastOrderTime = now;
      } else {
        console.error(
          `Order failed on increase: ${orderResponse.retMsg || "Unknown error"}`
        );
      }

      isBusy = false;
    }

    // תנאי להזמנה בעקבות ירידה
    if (
      percentageChangeDown >= stepPercentage &&
      now - lastOrderTime >= debounceTime &&
      !isBusy
    ) {
      console.log(
        `Price decreased by ${stepPercentage}%. Placing order for downward trend.`
      );
      isBusy = true;

      const minOrderSize = await getMinOrderSize(symbol);
      if (quantity < minOrderSize) {
        console.error(
          `Quantity ${quantity} is less than the minimum order size ${minOrderSize} for ${symbol}. Skipping.`
        );
        isBusy = false;
        return;
      }

      const orderResponse = await placeOrder(symbol, side, quantity);

      if (orderResponse && orderResponse.retCode === 0) {
        console.log(
          "Order placed successfully on decrease. Updating min price..."
        );
        minPriceSinceOrder = currentPrice;
        lastOrderTime = now;
      } else {
        console.error(
          `Order failed on decrease: ${orderResponse.retMsg || "Unknown error"}`
        );
      }

      isBusy = false;
    }

    // עדכון מחירי המעקב
    if (currentPrice > maxPriceSinceOrder) {
      maxPriceSinceOrder = currentPrice;
    }
    if (currentPrice < minPriceSinceOrder) {
      minPriceSinceOrder = currentPrice;
    }
  };
};
