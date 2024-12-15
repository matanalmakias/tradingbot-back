import { calculateRSI2 } from "./calculateRSI2.js";
import { getHistoricalPrices } from "./getHistoricalPrices.js";

export const getRSIForSymbols = async (
  symbols,
  period = 14,
  interval = 15,
  start = null,
  end = null
) => {
  const rsiResults = [];

  for (const symbol of symbols) {
    try {
      // console.log(`Fetching data for ${symbol}...`);
      const closes = await getHistoricalPrices(
        symbol,
        interval,
        200,
        start,
        end
      );

      if (!closes || closes.length < period) {
        console.warn(`Skipping ${symbol} due to insufficient data.`);
        continue;
      }

      const rsi = calculateRSI2(closes, period);

      if (rsi === null || isNaN(rsi[rsi.length - 1])) {
        console.warn(`Invalid RSI for ${symbol}.`);
        continue;
      }

      rsiResults.push({ symbol, rsi: rsi[rsi.length - 1] });
    } catch (error) {
      console.error(`Error calculating RSI for ${symbol}:`, error.message);
    }
  }

  return rsiResults.sort((a, b) => a.rsi - b.rsi);
};
