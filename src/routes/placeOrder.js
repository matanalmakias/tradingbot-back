import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
dotenv.config();
// יצירת לקוח Bybit
const client = new RestClientV5({
  testnet: false, // עבור Testnet שנה ל- false לפרודקשן
  key: process.env.BYBIT_API_KEY, // מפתח ה-API שלך
  secret: process.env.BYBIT_API_SECRET, // סוד ה-API שלך
});

// פונקציה לביצוע פקודה
export const placeOrder = async (symbol, side, quantity, price = null) => {
  try {
    // בניית גוף הבקשה
    const orderPayload = {
      category: "linear", // קטגוריה למסחר בחוזים עתידיים
      symbol, // מטבע (לדוגמה: BTCUSDT)
      side, // כיוון המסחר ("Buy" או "Sell")
      orderType: price ? "Limit" : "Market", // סוג הפקודה
      qty: quantity.toString(), // כמות המסחר, חייבת להיות מחרוזת
      timeInForce: "GoodTillCancel", // ברירת מחדל, אפשר לשנות
    };

    if (price) {
      orderPayload.price = price.toFixed(2); // מחיר, אם מדובר בפקודת Limit
    }

    // קריאה ל-API
    const response = await client.submitOrder(orderPayload);

    // בדיקת תגובה
    if (response.retCode !== 0) {
      console.error(`Order failed: ${response.retMsg}`);
      throw new Error(response.retMsg);
    }

    console.log("Order placed successfully:", response);
    return response;
  } catch (error) {
    console.error("Error placing order:", error.message);
    return null;
  }
};
