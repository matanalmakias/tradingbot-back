import { Router } from "express";
import { connectWebSocket } from "../functions/socket/connectWebSocket.js";

const router = Router();

router.post("/startPosition", (req, res) => {
  const { symbol, side, quantity, stepPercentage } = req.body;

  if (!symbol || !side || !quantity || !stepPercentage) {
    console.error("Missing required parameters:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters." });
  }

  try {
    console.log(
      `Starting DCA for ${symbol} with ${side} ${quantity} units at ${stepPercentage}% step.`
    );
    connectWebSocket(symbol, side, quantity, stepPercentage);
    res.json({ success: true, message: "DCA strategy started." });
  } catch (error) {
    console.error("Error starting position:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as positionRouter };
