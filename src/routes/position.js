// routes/positionRouter.js
import { Router } from "express";
import { connectWebSocket } from "../functions/socket/connectWebSocket.js";
import { processPrice } from "../functions/socket/proccessPrice.js";

const router = Router();
router.post("/processPrice", async (req, res) => {
  const {
    symbol,
    side,
    quantity,
    stepPercentage,
    roiTakeProfit,
    roiBuyThreshold,
    useAI,
    aiThreshold, // שמור את הפרמטר aiThreshold
    debounceTime,
  } = req.body;
  (async () => {
    await processPrice(
      symbol,
      side,
      quantity,
      stepPercentage, // stepPercentage
      roiTakeProfit, // roiTakeProfit
      roiBuyThreshold, // roiBuyThreshold
      useAI, // useAI
      aiThreshold, // aiThreshold
      debounceTime, // debounceTime
      (newPrice) => {
        console.log(`Initial price updated to: ${newPrice}`);
      },
      () => false, // getIsBusy
      (busy) => {
        console.log(`isBusy set to: ${busy}`);
      },
      () => lastOrderTime,
      (time) => {
        console.log(`Last order time updated to: ${time}`);
      }
    );
  })();
});
router.post("/startPosition", (req, res) => {
  const {
    symbol,
    side,
    quantity,
    stepPercentage,
    roiTakeProfit,
    roiBuyThreshold,
    round,
    aiThreshold, // שמור את הפרמטר aiThreshold
    debounceTime,
  } = req.body;

  // בדוק אם יש ערכים חסרים
  if (
    !symbol ||
    !side ||
    !quantity ||
    !stepPercentage ||
    roiTakeProfit === undefined ||
    aiThreshold === undefined ||
    debounceTime === undefined
  ) {
    console.error("Missing required parameters:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters." });
  }

  try {
    console.log(
      `Starting DCA for ${symbol} with ${side} ${quantity} units at ${stepPercentage}% step. Take Profit Target: ${roiTakeProfit}%, AI Threshold: ${aiThreshold}%`
    );
    // העברת כל הערכים לפונקציה connectWebSocket כולל aiThreshold
    connectWebSocket(
      symbol,
      side,
      quantity,
      stepPercentage,
      roiTakeProfit,
      roiBuyThreshold,
      round,
      aiThreshold, // העבר את aiThreshold
      debounceTime
    );
    res.json({ success: true, message: "DCA strategy started." });
  } catch (error) {
    console.error("Error starting position:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as positionRouter };
