import { Router } from "express";
import { getTopCoinsByVolume } from "../functions/get/getTopCoinsByVolume.js";
import { getRSIForCoins } from "../functions/get/getRSIForCoins.js";

const router = Router();

router.get("/getTopCoinsByRSI", async (req, res) => {
  const limit = parseInt(req.query.limit) || 50; // כמות המטבעות
  const timeframe = req.query.timeframe || "24h"; // ברירת מחדל 24 שעות
  const period = parseInt(req.query.period) || 14; // תקופת RSI
  const interval = req.query.interval || "60"; // רזולוציה ב-60 דקות

  try {
    // שלב 1: שליפת המטבעות עם הנפח הכי גבוה
    const topCoins = await getTopCoinsByVolume(limit, timeframe);

    // שלב 2: חישוב ה-RSI עבור המטבעות שנבחרו
    const coinsByRSI = await getRSIForCoins(topCoins, period, interval);

    res.json({ success: true, data: coinsByRSI });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as coinsRouter };
