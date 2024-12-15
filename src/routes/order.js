import { Router } from "express";
import { placeOrder } from "../functions/place-order/placeOrder.js";
import { connectWebSocket } from "../functions/socket/connectWebSocket.js";

const router = Router();

router.post("/placeOrder", async (req, res) => {
  const { symbol, side, quantity, price } = req.body;

  if (!symbol || !side || !quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters." });
  }

  try {
    const response = await placeOrder(symbol, side, quantity, price);
    res.json({
      success: true,
      message: "Order placed successfully.",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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
