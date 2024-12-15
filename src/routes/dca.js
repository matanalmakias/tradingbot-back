import { Router } from "express";
import { manageDCA } from "../functions/dca/manageDCA.js";

const router = Router();

router.post("/startDCA", async (req, res) => {
  const { symbol } = req.body; // המטבע לניהול פוזיציה
  if (!symbol)
    return res
      .status(400)
      .json({ success: false, message: "Symbol is required" });

  try {
    await manageDCA(symbol);
    res.json({ success: true, message: `DCA started for ${symbol}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as dcaRouter };
