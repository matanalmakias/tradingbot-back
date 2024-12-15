import axios from "axios";

const baseURL = "https://api.bybit.com";

export const getTopCoinsByVolume = async (limit = 50, timeframe = "24h") => {
  try {
    const response = await axios.get(`${baseURL}/v5/market/tickers`, {
      params: {
        category: "futures", // אנחנו עובדים עם FUTURES
      },
    });

    const data = response.data.result.list || [];

    // סינון ומיון לפי נפח (Volume) בפרמטר הזמן המבוקש
    return data
      .map((item) => ({
        symbol: item.symbol,
        volume: parseFloat(item[`volume${timeframe}`]), // למשל: volume24h
      }))
      .filter((item) => item.volume > 0) // רק מטבעות עם נפח גדול מ-0
      .sort((a, b) => b.volume - a.volume) // מיון מהגבוה לנמוך
      .slice(0, limit); // חיתוך לפי LIMIT
  } catch (error) {
    console.error("Error fetching top coins by volume:", error.message);
    throw error;
  }
};
