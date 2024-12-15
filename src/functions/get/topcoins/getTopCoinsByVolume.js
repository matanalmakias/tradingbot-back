import { RestClientV5 } from "bybit-api";

const client = new RestClientV5({
  testnet: false, // השתמש ב-testnet=false עבור עבודה עם ה-API הראשי
});

export const getTopCoinsByVolume = async (
  limit = 10, // ברירת מחדל: 10 מטבעות
  category = "linear" // ברירת מחדל: Futures (USDT Perpetual)
) => {
  try {
    // בקשת נתוני מטבעות
    const response = await client.getTickers({ category });
    const data = response.result?.list || [];

    // מיפוי נתונים עבור נפח מסחר
    const topCoins = data
      .map((item) => ({
        symbol: item.symbol,
        volume: parseFloat(item.volume24h), // נפח ב-24 שעות
      }))
      .sort((a, b) => b.volume - a.volume) // מיון לפי Volume יורד
      .slice(0, limit); // קח את המטבעות עם נפח המסחר הגבוה ביותר

    console.log("Top Coins by Volume:", topCoins); // הדפסת התוצאה
    return topCoins;
  } catch (error) {
    console.error("Error in getTopCoinsByVolume:", error.message);
    throw new Error(
      error.response?.data?.retMsg || "Failed to fetch top coins by volume."
    );
  }
};
