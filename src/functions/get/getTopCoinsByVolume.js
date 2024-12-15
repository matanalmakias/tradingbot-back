import axios from "axios";

export const getTopCoinsByVolume = async (
  limit,
  timeframe,
  category = "linear"
) => {
  try {
    const response = await axios.get(
      "https://api.bybit.com/v5/market/tickers",
      {
        params: {
          category, // קטגוריה: 'spot', 'linear', 'inverse'
        },
      }
    );

    // console.log("API Response:", response.data); // בדיקה שה-API מחזיר נתונים

    const data = response.data.result?.list || [];

    // console.log("Coins Data:", data); // בדיקה שהנתונים נקלטים

    const topCoins = data
      .map((item) => ({
        symbol: item.symbol,
        volume24h: parseFloat(item.volume24h || 0), // נפח 24 שעות
      }))
      .filter((item) => item.volume24h > 0)
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, limit);

    // console.log("Top Coins by Volume:", topCoins); // בדיקה אחרי עיבוד נתונים

    return topCoins;
  } catch (error) {
    console.error("Error in getTopCoinsByVolume:", error.message);
    throw new Error(
      error.response?.data?.retMsg || "Failed to fetch top coins."
    );
  }
};
