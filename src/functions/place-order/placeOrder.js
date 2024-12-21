import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
import { testnetValue } from "../utils/utils.js";
dotenv.config();

// יצירת לקוח Bybit
const client = new RestClientV5({
  testnet: testnetValue,
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

// פונקציה מאוחדת לקנייה ולמכירה
export const placeOrder = async ({
  symbol,
  side, // "Buy" או "Sell"
  quantity,
  simulation = false,
  category = "linear", // סוג המוצר
  orderType = "Market", // סוג ההוראה
  price = null, // מחיר ההוראה (רק אם Limit)
  positionIdx = 0, // ברירת מחדל ל-0
  timeInForce = "IOC", // או GoodTillCancel
  reduceOnly = false, // למכירה בלבד
  closeOnTrigger = false, // לסגירה בטריגר
}) => {
  // בדיקת מצב סימולציה
  if (simulation) {
    console.log(
      `[SIMULATION] Would place order: ${side} ${quantity} of ${symbol}`
    );
    return { success: true, message: "Simulation: Order placed." };
  }

  try {
    // בניית פרמטרים לקריאה ל-API
    const params = {
      category,
      symbol,
      side,
      orderType,
      qty: quantity.toString(), // לוודא כי הכמות היא מחרוזת
      timeInForce,
    };

    if (positionIdx !== undefined) {
      params.positionIdx = positionIdx;
    }

    if (reduceOnly) {
      params.reduceOnly = reduceOnly;
    }

    if (closeOnTrigger) {
      params.closeOnTrigger = closeOnTrigger;
    }

    if (orderType === "Limit" && price) {
      params.price = price.toString(); // הוספת מחיר אם מדובר ב-Limit
    }

    // קריאה ל-API
    const response = await client.submitOrder(params);

    // טיפול בתגובה
    if (response.retCode === 0) {
      console.log(
        `Order placed successfully: ${side} ${quantity} of ${symbol}`
      );
      return response;
    } else {
      console.error(`Error placing order: ${response.retMsg}`);
      return { success: false, message: response.retMsg };
    }
  } catch (error) {
    console.error("Error placing order:", error.message);
    return { success: false, message: error.message };
  }
};
