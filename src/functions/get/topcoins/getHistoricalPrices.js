import axios from "axios";

export const getHistoricalPrices = async (
  symbol,
  interval = 15,
  limit = 200,
  start = null,
  end = null
) => {
  try {
    const params = {
      category: "linear", // ברירת מחדל למסחר בחוזים עתידיים
      symbol,
      interval: interval.toString(), // האינטרוול חייב להיות מחרוזת
      limit, // מספר הנרות (עד 1000)
    };

    // הוספת start ו-end אם הם מוגדרים
    if (start) params.start = start;
    if (end) params.end = end;

    const response = await axios.get(`https://api.bybit.com/v5/market/kline`, {
      params,
    });

    if (response.data.retCode !== 0) {
      console.error(
        `Error fetching historical prices for ${symbol}: ${response.data.retMsg}`
      );
      return [];
    }

    const closes = response.data.result.list.map((kline) =>
      parseFloat(kline[4])
    ); // עמודת Close

    if (!closes || closes.length === 0) {
      console.warn(`No closing prices for ${symbol}.`);
      return [];
    }

    return closes;
  } catch (error) {
    console.error(
      `Error fetching historical prices for ${symbol}: ${error.message}`
    );
    return [];
  }
};
