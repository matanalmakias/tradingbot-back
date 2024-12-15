import { Router } from "express";
import { getTopCoinsByVolume } from "../functions/get/getTopCoinsByVolume.js";
import { getRSIForCoins } from "../functions/get/getRSIForCoins.js";
import { startPosition } from "../functions/get/startPosition/startPosition.js";

const router = Router();
router.post("/startPosition", async (req, res) => {
  const { symbol, initialInvestment, dcaPercentage } = req.body;

  if (!symbol || !initialInvestment || !dcaPercentage) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: symbol, initialInvestment, dcaPercentage",
    });
  }

  try {
    const position = await startPosition(
      symbol,
      initialInvestment,
      dcaPercentage
    );
    res.json({ success: true, data: position });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/getTopCoinsByRSI", async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const timeframe = req.query.timeframe || "24h";
  const period = parseInt(req.query.period) || 14;
  const interval = req.query.interval || "60";
  const category = req.query.category || "linear";

  try {
    console.log("Fetching top coins...");
    const topCoins = await getTopCoinsByVolume(limit, timeframe, category);

    // console.log("Top coins fetched:", topCoins);

    if (!topCoins.length) {
      throw new Error("No top coins found.");
    }

    console.log("Calculating RSI...");
    const coinsByRSI = await getRSIForCoins(topCoins, period, interval);

    // console.log("RSI Calculation Complete:", coinsByRSI);

    res.json({ success: true, data: coinsByRSI });
  } catch (error) {
    console.error("Error in getTopCoinsByRSI:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as coinsRouter };
