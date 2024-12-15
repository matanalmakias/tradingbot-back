import { Router } from "express";
import { getRSIForSymbols } from "./../functions/get/topcoins/getRSIForSymbols.js";

const router = Router();

router.post("/getRSIForSymbols", async (req, res) => {
  const { symbols, period = 14, interval = 15, start, end } = req.body;

  if (!Array.isArray(symbols) || symbols.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid array of symbols.",
    });
  }

  try {
    const result = await getRSIForSymbols(
      symbols,
      period,
      interval,
      start,
      end
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as rsiRouter };
