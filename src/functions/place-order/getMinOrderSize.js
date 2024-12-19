import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
dotenv.config();

const client = new RestClientV5({
  testnet: false,
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const getMinOrderSize = async (symbol) => {
  try {
    const response = await client.getTickers({ category: "linear", symbol });
    if (response.retCode === 0) {
      const minSize = parseFloat(response.result.list[0].minOrderQty);
      return minSize;
    } else {
      console.warn(
        `Failed to fetch min order size for ${symbol}. Defaulting to 1.`
      );
      return 1; // ערך ברירת מחדל
    }
  } catch (error) {
    console.error("Error fetching minimum order size:", error.message);
    return 1; // ערך ברירת מחדל
  }
};
