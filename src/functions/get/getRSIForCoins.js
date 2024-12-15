import { getHistoricalPrices } from "./getHistoricalPrices.js";
import { calculateRSI } from "./calculateRSI.js";

export const getRSIForCoins = async (coins, period = 14, interval = "60") => {
  const rsiResults = [];

  for (const coin of coins) {
    try {
      const closes = await getHistoricalPrices(coin.symbol, interval);
      if (!closes || closes.length === 0) {
        console.warn(`Skipping ${coin.symbol} due to missing data.`);
        continue;
      }

      const rsi = calculateRSI(closes, period);
      rsiResults.push({
        symbol: coin.symbol,
        rsi: rsi[rsi.length - 1],
        volume: coin.volume,
      });
    } catch (error) {
      console.error(`Error calculating RSI for ${coin.symbol}:`, error.message);
    }
  }

  return rsiResults.sort((a, b) => a.rsi - b.rsi); // מיון לפי RSI מהנמוך לגבוה
};
