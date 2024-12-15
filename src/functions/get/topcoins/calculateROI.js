export const calculateROI = (currentPrice, quantity, stepPercentage) => {
  const initialInvestment = quantity * currentPrice;
  const stepValue = initialInvestment * (stepPercentage / 100);
  return (stepValue / initialInvestment) * 100;
};
