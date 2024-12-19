import { Router } from "express";
import { placeOrder } from "../functions/place-order/placeOrder.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.post("/placeOrder", async (req, res) => {
  const { symbol, side, quantity, price } = req.body;

  if (!symbol || !side || !quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters" });
  }

  try {
    const response = await placeOrder(symbol, side, quantity);

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// WebSocket לאסטרטגיות
router.post("/startWebSocket", (req, res) => {
  const { symbol, side, quantity, stepPercentage } = req.body;

  if (!symbol || !side || !quantity || !stepPercentage) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters." });
  }

  try {
    console.log(
      `Starting WebSocket for ${symbol} with stepPercentage: ${stepPercentage}`
    );
    connectWebSocket(symbol, side, quantity, stepPercentage);
    res.json({ success: true, message: "WebSocket strategy started." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as orderRouter };
