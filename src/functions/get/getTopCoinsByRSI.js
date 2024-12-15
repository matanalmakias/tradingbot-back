import { getTopCoinsByVolume } from "./getTopCoinsByVolume.js";
import { getHistoricalPrices } from "./getHistoricalPrices.js";
import { calculateRSI } from "./calculateRSI.js";

export const getTopCoinsByRSI = async (limit, period) => {
  const coinsByVolume = await getTopCoinsByVolume(limit); // שלוף את המטבעות עם ה-VOLUME הגבוה ביותר
  const rsiResults = [];
  return console.log(coinsByVolume);
  for (const coin of coinsByVolume) {
    const closes = await getHistoricalPrices(coin.symbol); // קבל נתונים היסטוריים
    if (!closes) continue;

    const rsi = calculateRSI(closes, period);
    rsiResults.push({ symbol: coin.symbol, rsi: rsi[rsi.length - 1] });
  }

  // סידור ה-RSI מהנמוך לגבוה
  return rsiResults.sort((a, b) => a.rsi - b.rsi);
};
