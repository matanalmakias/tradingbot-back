import { getHistoricalPrices } from "./getHistoricalPrices.js"; // עדכון הנתיב
import { calculateRSI } from "./calculateRSI.js";
import { getTopCoins } from "./getTopCoins.js";

export const analyzeTopCoins = async () => {
  try {
    const coins = await getTopCoins(); // שליפת 200 המטבעות המובילים

    const rsiResults = await Promise.all(
      coins.map(async (coin) => {
        const closes = await getHistoricalPrices(coin.symbol); // מחירי סגירה
        if (!closes || closes.length < 15) return null; // אם אין מספיק נתונים
        const rsi = calculateRSI(closes);
        return { symbol: coin.symbol, rsi };
      })
    );

    // סינון ודירוג לפי RSI
    const sortedRSI = rsiResults
      .filter(Boolean) // הסר תוצאות null
      .sort((a, b) => a.rsi - b.rsi); // דירוג לפי RSI (נמוך לגבוה)

    console.log("Coins ranked by RSI:", sortedRSI);
  } catch (error) {
    console.error("Error analyzing top coins:", error);
  }
};
