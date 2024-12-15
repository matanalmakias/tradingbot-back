import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "https://api.bybit.com";

export const getTopCoins = async () => {
  try {
    const apiKey = process.env.BYBIT_API_KEY;

    if (!apiKey) {
      throw new Error("API Key is missing. Please check your .env file.");
    }

    const response = await axios.get(`${baseURL}/v5/market/tickers`, {
      headers: {
        "X-BYBIT-API-KEY": apiKey, // שימוש במפתח ה-API
      },
      params: {
        category: "spot", // עבור מטבעות Spot
      },
    });

    // סינון ודירוג לפי ווליום
    const coins = response.data.result.list
      .sort((a, b) => parseFloat(b.turnover24h) - parseFloat(a.turnover24h)) // דירוג לפי ווליום
      .slice(0, 200); // 200 הראשונים

    // console.log(
    //   "Top 200 Coins by Volume:",
    //   coins.map((coin) => coin.symbol)
    // );
    return coins;
  } catch (error) {
    console.error(
      "Error fetching top coins:",
      error?.response?.data || error.message
    );
  }
};
