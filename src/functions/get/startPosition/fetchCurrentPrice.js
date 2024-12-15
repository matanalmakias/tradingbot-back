import axios from "axios";

const baseURL = "https://api.bybit.com";

export const fetchCurrentPrice = async (symbol) => {
  try {
    console.log("Fetching price with params:", { category: "linear", symbol });

    const response = await axios.get(`${baseURL}/v5/market/tickers`, {
      params: { category: "linear", symbol },
    });

    console.log("Full API Response:", JSON.stringify(response.data, null, 2));

    const price = parseFloat(response.data.result.list[0]?.lastPrice);
    if (!price) {
      throw new Error(`Price not found for ${symbol}`);
    }

    console.log("Current price:", price);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return null;
  }
};
