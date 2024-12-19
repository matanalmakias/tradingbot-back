// routes/takeProfitRouter.js
import { Router } from "express";
import { takeProfitStrategy } from "../functions/take-profit-strategy/takeProfitStrategy.js";
import { getAIDecision } from "../functions/get/startPosition/getAIDecision.js";

const router = Router();
router.post("/aiDecision", async (req, res) => {
  const { symbol, category, currentPrice, initialPrice, positionSize } =
    req.body;

  const roi = ((currentPrice - initialPrice) / initialPrice) * 100;
  getAIDecision(symbol, currentPrice, roi, initialPrice, positionSize);
});
router.post("/startTakeProfit", (req, res) => {
  const { symbol, category, roiTarget, qtyToSell, debounceTime } = req.body;

  // בדיקת פרמטרים נדרשים
  if (!symbol || !category || roiTarget === undefined || !qtyToSell) {
    console.error("Missing required parameters:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters." });
  }

  try {
    console.log(
      `Starting Take Profit Strategy for ${symbol} with ROI Target: ${roiTarget}%, Quantity to Sell: ${qtyToSell}`
    );

    takeProfitStrategy(
      symbol,
      category,
      roiTarget,
      qtyToSell,
      debounceTime // דיפולטית 60 שניות אם לא נשלח
    );

    res.json({ success: true, message: "Take Profit Strategy started." });
  } catch (error) {
    console.error("Error starting Take Profit Strategy:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as takeProfitRouter };
