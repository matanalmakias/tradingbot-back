import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
dotenv.config();

const client = new RestClientV5({
  testnet: true, // True אם אתה על Testnet
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const placeOrder22 = async (symbol, side, quantity, price = null) => {
  try {
    const orderPayload = {
      category: "linear",
      symbol,
      side,
      orderType: price ? "Limit" : "Market",
      qty: quantity,
      timeInForce: "GTC", // Good-Till-Cancel
    };

    if (price) orderPayload.price = price.toFixed(4);

    console.log("Sending order with payload:", orderPayload);

    const response = await client.submitOrder(orderPayload);

    if (response.retCode === 0) {
      console.log("Order placed successfully:", response.result);
      return response.result;
    } else {
      console.error("Order failed:", response.retMsg);
      return null;
    }
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw error;
  }
};
