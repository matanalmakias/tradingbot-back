import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
import { testnetValue } from "../utils/utils.js";
dotenv.config();

const client = new RestClientV5({
  testnet: testnetValue,
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const placeOrder = async (
  symbol,
  side,
  quantity,
  simulation = false,
  category = "linear",
  orderType = "Market",
  price = null,
  positionIdx = 0,
  timeInForce = "IOC",
  reduceOnly = false,
  closeOnTrigger = false
) => {
  if (simulation) {
    console.log(
      `[SIMULATION] Would place order: ${side} ${quantity} of ${symbol}`
    );
    return { success: true, message: "Simulation: Order placed." };
  }

  try {
    const params = {
      category,
      symbol,
      side,
      orderType,
      qty: quantity.toString(), // ודא כי הכמות היא מחרוזת
      timeInForce,
      positionIdx,
      reduceOnly,
      closeOnTrigger,
    };

    if (orderType === "Limit" && price) {
      params.price = price.toString();
    }

    const response = await client.submitOrder(params);

    if (response.retCode === 0) {
      console.log(
        `Order placed successfully: ${side} ${quantity} of ${symbol}`
      );
      return response;
    } else {
      console.error(`Error placing order: ${response.retMsg}`);
      return response;
    }
  } catch (error) {
    console.error("Error placing order:", error.message);
    return { success: false, message: error.message };
  }
};
