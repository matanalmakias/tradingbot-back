import axios from "axios";

export const fetchTopCoins = async () => {
  try {
    const response = await axios.get(
      "https://api.bybit.com/v5/market/tickers",
      {
        params: {
          category: "futures",
        },
      }
    );

    console.log("Full API Response:", response.data);

    if (!response.data.result?.list) {
      console.error("No list data found in the response.");
      return [];
    }

    const data = response.data.result.list.map((item) => ({
      symbol: item.symbol,
      volume24h: item.volume24h,
    }));
    console.log("Extracted Symbols and Volumes:", data);

    return data;
  } catch (error) {
    console.error("Error fetching API data:", error.message);
    console.error(error.response?.data || error.message);
  }
};
