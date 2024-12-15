import { Router } from "express";
import { getTopCoinsByVolume } from "../functions/get/topcoins/getTopCoinsByVolume.js";
import { getRSIForCoins } from "../functions/get/topcoins/getRSIForCoins.js";
import { getTopCoinsByRSI } from "../functions/get/topcoins/getTopCoinsByRSI.js";

const router = Router();

router.get("/getTopCoinsByRSI", async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const timeframe = req.query.timeframe || "24h";
  const period = parseInt(req.query.period) || 14;
  const interval = req.query.interval || "60";
  const category = req.query.category || "inverse";

  try {
    console.log("Fetching top coins...");
    const topCoins = await getTopCoinsByVolume(limit, category, timeframe);
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
router.get("/getTopCoinsByRSI2", async (req, res) => {
  (async () => {
    try {
      const result = await getTopCoinsByRSI(10, 14, 60, "linear");
      console.log("Top Coins by RSI:", result);
    } catch (error) {
      console.error("Error:", error.message);
    }
  })();
});

export { router as coinsRouter };
