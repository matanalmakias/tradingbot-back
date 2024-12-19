import WebSocket from "ws";
import { processPrice } from "./proccessPrice.js";
import { Connection } from "../../db/models/connection.js";
import { RestClientV5 } from "bybit-api";

const client = new RestClientV5({
  testnet: false, // שנה ל-false אם אתה עובד על חשבון אמיתי
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

async function validateQuantity(symbol, quantity) {
  try {
    const response = await client.getSymbolInfo({ symbol });
    const { minTradingQty, qtyStep } = response.result;

    // בדיקת מינימום ומכפלה
    if (quantity < minTradingQty) {
      console.error(
        `Quantity too small: ${quantity}. Minimum: ${minTradingQty}`
      );
      return minTradingQty;
    }
    // התאמת הכמות למכפלה
    const adjustedQty = Math.floor(quantity / qtyStep) * qtyStep;
    console.log(`Adjusted quantity for ${symbol}: ${adjustedQty}`);
    return adjustedQty;
  } catch (error) {
    console.error("Error validating quantity:", error.message);
    throw error;
  }
}
