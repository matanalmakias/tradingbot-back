import { fetchCurrentPrice } from "./fetchCurrentPrice.js";

export const monitorPosition = (position) => {
  setInterval(async () => {
    const currentPrice = await fetchCurrentPrice(position.symbol);

    if (!currentPrice) {
      console.error(`Failed to fetch price for ${position.symbol}`);
      return;
    }

    const roi =
      ((currentPrice - position.averagePrice) / position.averagePrice) * 100;

    if (Math.abs(roi - position.roi) >= position.dcaPercentage) {
      const investment = position.totalInvestment * 0.1; // נגיד 10% מההשקעה הנוכחית
      const quantity = investment / currentPrice;

      position.averagePrice =
        (position.totalInvestment + investment) /
        (position.quantity + quantity);

      position.totalInvestment += investment;
      position.quantity += quantity;
      position.roi = roi;

      console.log(
        `DCA Executed for ${position.symbol}: New Average Price: ${position.averagePrice}`
      );
    } else {
      console.log(
        `No action needed for ${position.symbol}. Current ROI: ${roi}%`
      );
    }
  }, 60000); // בודק כל דקה
};
