import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
dotenv.config();

const client = new RestClientV5({
  testnet: false,
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const placeOrder = async (symbol, side, quantity, price = null) => {
  try {
    const orderPayload = {
      category: "linear", // Futures (USDT Perpetual)
      symbol,
      side,
      orderType: price ? "Limit" : "Market",
      qty: quantity,
      timeInForce: "GoodTillCancel",
    };

    if (price) {
      orderPayload.price = price.toFixed(4);
    }

    const response = await client.submitOrder(orderPayload);
    console.log("Order placed successfully:", response);
    return response;
  } catch (error) {
    console.error("Error placing order:", error.message);
    return null;
  }
};
