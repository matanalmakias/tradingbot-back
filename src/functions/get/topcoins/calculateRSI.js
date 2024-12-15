export const calculateRSI = (closes, period = 14) => {
  if (!closes || closes.length < period) {
    throw new Error("Not enough data to calculate RSI.");
  }

  let avgGain = 0;
  let avgLoss = 0;

  // חישוב ראשוני של ממוצע רווחים והפסדים
  for (let i = 1; i <= period; i++) {
    const difference = closes[i] - closes[i - 1];
    if (difference > 0) {
      avgGain += difference;
    } else {
      avgLoss += Math.abs(difference);
    }
  }
  avgGain /= period;
  avgLoss /= period;

  let rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
  let rsi = [100 - 100 / (1 + rs)];

  // חישוב RSI למידע הנותר
  for (let i = period + 1; i < closes.length; i++) {
    const difference = closes[i] - closes[i - 1];
    const gain = Math.max(difference, 0);
    const loss = Math.abs(Math.min(difference, 0));

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
};
