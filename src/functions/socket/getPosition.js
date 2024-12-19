// functions/get/getPosition.js
import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
import { testnetValue } from "../../utils/utils.js";
dotenv.config();
const client = new RestClientV5({
  testnet: testnetValue,
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const getPosition = async (symbol) => {
  try {
    const response = await client.getPositionInfo({
      category: "linear", // שנה ל-'inverse' אם נדרש
      symbol,
    });
    if (response.retCode === 0 && response.result.list.length > 0) {
      // מחזיר את הפוזיציה הפעילה הראשונה
      return response.result.list[0];
    } else {
      console.log("No active position found for symbol:", symbol);
      return null;
    }
  } catch (error) {
    console.error("Error fetching position:", error.message);
    return null;
  }
};
