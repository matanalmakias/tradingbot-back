import { placeOrder } from "../place-order/placeOrder";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AI_DEBOUNCE_TIME = 60000; // 60 שניות
let lastAIDecisionTime = 0; // זמן הקריאה האחרונה ל-AI

export const processPrice = async (
  currentPrice,
  symbol,
  side,
  quantity,
  stepPercentage,
  roiTakeProfit, // 0.4%
  roiBuyThreshold,
  useAI,
  aiThreshold, // 0.02%
  debounceTime,
  initialPrice,
  setInitialPrice,
  getIsBusy,
  setIsBusy,
  getLastOrderTime,
  setLastOrderTime,
  getBuyQuantity
) => {
  const now = Date.now();
  const roi = ((currentPrice - initialPrice) / initialPrice) * 100;

  console.log(
    `Currency: ${symbol} | Current price: ${currentPrice} | ROI: ${roi.toFixed(
      2
    )}% | Initial Price: ${initialPrice}`
  );

  if (!getIsBusy()) {
    // בדיקת Step Percentage
    if (roi <= -stepPercentage) {
      console.log(`Condition met for Buy based on ROI: ${roi.toFixed(2)}%`);
      setIsBusy(true);
      try {
        const quantityToBuy = await getBuyQuantity(quantity);

        const orderResponse = await placeOrder(
          symbol,
          side,
          quantityToBuy,
          null,
          `linear`
        );
        // console.log("Buy order response:", orderResponse);
        setLastOrderTime(now);
        setInitialPrice(currentPrice);
      } catch (error) {
        console.error("Error in Buy Order:", error.message);
      } finally {
        console.log("Releasing isBusy flag after Buy Order.");
        setIsBusy(false);
      }
      await delay(debounceTime);
      return;
    }
  } else {
    console.log("Skipping order - isBusy flag is true.");
  }
};
