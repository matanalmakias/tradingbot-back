import { fetchCurrentPrice } from "../get/startPosition/fetchCurrentPrice.js";

let previousPrice = null; // נשמור את המחיר האחרון לפוזיציה
let position = 0; // כמות המטבעות שקנינו
const amountToBuy = 100; // כמות לרכישה בכל פעם
const percentageChange = 5; // אחוז השינוי ל-DCA

export const manageDCA = async (symbol) => {
  try {
    const currentPrice = await fetchCurrentPrice(symbol);
    if (!currentPrice) throw new Error("Failed to fetch current price");

    // חישוב אחוז השינוי במחיר
    if (previousPrice) {
      const change = ((currentPrice - previousPrice) / previousPrice) * 100;
      console.log(`Price change: ${change.toFixed(2)}%`);

      if (Math.abs(change) >= percentageChange) {
        // רכישת מטבעות
        position += amountToBuy;
        console.log(
          `DCA triggered for ${symbol}: Bought ${amountToBuy} at ${currentPrice}`
        );

        // עדכון המחיר האחרון
        previousPrice = currentPrice;
      }
    } else {
      // התחלה: שמירה של המחיר הראשון
      previousPrice = currentPrice;
      console.log(`Initial price set for ${symbol}: ${previousPrice}`);
    }
  } catch (error) {
    console.error(`Error in manageDCA for ${symbol}:`, error.message);
  }
};
