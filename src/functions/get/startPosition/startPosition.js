import { fetchCurrentPrice } from "./fetchCurrentPrice.js";
import { monitorPosition } from "./monitorPosition.js";

let activePositions = []; // מאגר פוזיציות בזיכרון

export const startPosition = async (
  symbol,
  initialInvestment,
  dcaPercentage
) => {
  const currentPrice = await fetchCurrentPrice(symbol);
  console.log(currentPrice);
  if (!currentPrice) {
    throw new Error(`Failed to fetch current price for ${symbol}`);
  }

  const initialQuantity = initialInvestment / currentPrice;

  const position = {
    symbol,
    averagePrice: currentPrice,
    totalInvestment: initialInvestment,
    quantity: initialQuantity,
    dcaPercentage,
    roi: 0,
  };

  activePositions.push(position);

  // הפעלה של ניטור אוטומטי
  monitorPosition(position);

  return position;
};
