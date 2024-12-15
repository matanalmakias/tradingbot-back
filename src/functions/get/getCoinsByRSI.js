import { getTopCoinsByVolume } from "./getTopCoinsByVolume.js";
import { getHistoricalPrices } from "./getHistoricalPrices.js";
import { calculateRSI } from "./calculateRSI.js";

export const getCoinsByRSI = async (limit = 50, period = 14) => {
  // קבלת המטבעות עם הנפח הגבוה ביותר
  const topCoins = await getTopCoinsByVolume(limit);

  if (!topCoins || topCoins.length === 0) {
    throw new Error("Failed to fetch top coins by volume");
  }

  const rsiResults = [];

  for (const coin of topCoins) {
    const symbol = coin.symbol;

    try {
      const closes = await getHistoricalPrices(symbol);
      if (!closes) {
        console.error(`Skipping ${symbol} due to missing data.`);
        continue;
      }

      const rsi = calculateRSI(closes, period);
      rsiResults.push({
        symbol,
        rsi: rsi[rsi.length - 1],
        volume: coin.volume,
      });
    } catch (error) {
      console.error(`Error calculating RSI for ${symbol}:`, error.message);
    }
  }

  return rsiResults.sort((a, b) => a.rsi - b.rsi); // מיון לפי RSI
};
