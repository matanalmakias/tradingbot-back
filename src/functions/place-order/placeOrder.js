import { RestClientV5 } from "bybit-api";

// יצירת לקוח Bybit
const client = new RestClientV5({
  testnet: true, // עבור Testnet שנה ל- false לפרודקשן
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
      qty: quantity, // כמות המסחר
      timeInForce: "GoodTillCancel", // ברירת מחדל, אפשר לשנות
    };

    if (price) {
      orderPayload.price = price.toFixed(4); // מחיר, אם מדובר בפקודת Limit
    }

    // קריאה ל-API
    const response = await client.submitOrder(orderPayload);

    console.log("Order placed successfully:", response);
    return response;
  } catch (error) {
    console.error("Error placing order:", error.message);
    return null;
  }
};
