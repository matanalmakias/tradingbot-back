export const calculateRSI2 = (closes, period = 14) => {
  if (!closes || closes.length < period) {
    throw new Error(
      `Not enough data to calculate RSI. Required: ${period}, Got: ${closes.length}`
    );
  }

  const gains = [];
  const losses = [];

  // חישוב שינויים בין סגירות
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) {
      gains.push(change);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(change));
    }
  }

  // ממוצעים ראשוניים של רווחים והפסדים
  let avgGain =
    gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let avgLoss =
    losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

  const rsi = [];
  let rs = avgGain / avgLoss;
  rsi.push(100 - 100 / (1 + rs));

  // חישוב RSI עבור כל שאר התקופות
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    rs = avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
};
