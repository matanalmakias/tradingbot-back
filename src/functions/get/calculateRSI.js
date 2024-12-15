export const calculateRSI = (closes, period = 14) => {
  const gains = [];
  const losses = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const rsi = [];
  let currentGain = avgGain;
  let currentLoss = avgLoss;

  for (let i = period; i < gains.length; i++) {
    currentGain = (currentGain * (period - 1) + gains[i]) / period;
    currentLoss = (currentLoss * (period - 1) + losses[i]) / period;

    const rs = currentGain / currentLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
};
