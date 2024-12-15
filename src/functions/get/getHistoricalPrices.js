import axios from "axios";

const baseURL = "https://api.bybit.com";

export const getHistoricalPrices = async (symbol) => {
  try {
    const response = await axios.get(`${baseURL}/v5/market/kline`, {
      params: {
        category: "linear", // Futures Market
        symbol,
        interval: "60", // 60-minute candlesticks
        limit: 200, // Maximum number of candlesticks
      },
    });

    const data = response.data.result?.list || [];
    return data.map((candle) => parseFloat(candle[4])); // Closing prices
  } catch (error) {
    console.error(
      `Error fetching historical prices for ${symbol}:`,
      error.message
    );
    return null;
  }
};
