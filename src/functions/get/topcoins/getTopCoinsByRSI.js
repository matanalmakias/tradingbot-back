import axios from "axios";
import { RestClientV5 } from "bybit-api";
import { getHistoricalPrices } from "./getHistoricalPrices.js"; // פונקציה שתביא נתונים היסטוריים
import { calculateRSI } from "./calculateRSI.js"; // פונקציה שתחשב RSI

const client = new RestClientV5({
  testnet: false,
});

export const getTopCoinsByRSI = async (limit, period, interval, category) => {
  try {
    // שלב 1: להביא את כל המטבעות בקטגוריה המבוקשת
    const response = await client.getTickers({
      category, // קטגוריה: linear (Futures), spot, inverse
    });

    const data = response.result?.list || [];
    const symbols = data.map((item) => item.symbol); // שליפת שמות המטבעות

    console.log(`Found ${symbols.length} symbols.`);

    // שלב 2: חישוב RSI עבור כל מטבע
    const rsiResults = [];

    for (const symbol of symbols) {
      const closes = await getHistoricalPrices(symbol, interval); // הבאת נתוני מחירי סגירה
      if (!closes) {
        console.warn(`Skipping ${symbol} due to missing data.`);
        continue;
      }

      try {
        const rsi = calculateRSI(closes, period); // חישוב RSI
        rsiResults.push({ symbol, rsi: rsi[rsi.length - 1] }); // שמירה של ערך ה-RSI האחרון
      } catch (error) {
        console.error(`Error calculating RSI for ${symbol}:`, error.message);
      }
    }

    // שלב 3: מיון המטבעות לפי RSI
    const sortedByRSI = rsiResults
      .sort((a, b) => a.rsi - b.rsi) // ממיין לפי RSI בסדר עולה
      .slice(0, limit); // לוקח את הראשונים

    return sortedByRSI;
  } catch (error) {
    console.error("Error in getTopCoinsByRSI:", error.message);
    throw new Error(
      error.response?.data?.retMsg || "Failed to fetch top coins by RSI."
    );
  }
};
