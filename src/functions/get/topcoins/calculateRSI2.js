export const calculateRSI2 = (closes, period = 14) => {
  if (!closes || closes.length <= period) {
    throw new Error(
      `Not enough data to calculate RSI. Required: ${period + 1}, Got: ${
        closes.length
      }`
    );
  }

  let gains = 0;
  let losses = 0;

  const rsi = [];

  // שלב 1: חישוב רווחים והפסדים ראשוניים עבור התקופה הראשונה
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // חישוב RSI ראשון
  const rs = avgGain / avgLoss;
  rsi.push(100 - 100 / (1 + rs));

  // שלב 2: חישוב ממוצעים מתגלגלים (Smoothed Moving Average)
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
      avgGain = (avgGain * (period - 1)) / period;
    }

    const rs = avgGain / avgLoss;
    const currentRSI = 100 - 100 / (1 + rs);
    rsi.push(currentRSI);
  }

  return rsi;
};
