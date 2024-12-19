import { RestClientV5 } from "bybit-api";

const client = new RestClientV5({
  testnet: false, // שנה ל-true אם אתה עובד ב-Testnet
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

async function getMinimumQty(symbol) {
  try {
    const response = await client.getInstrumentsInfo({
      category: "linear", // או "spot" אם מדובר בשוק ספוט
      symbol: symbol,
    });
    console.log(response.result.list[0].lotSizeFilter);
    if (response.retCode === 0 && response.result.list.length > 0) {
      const symbolInfo = response.result.list[0];
      console.log(`Symbol: ${symbol}`);
      console.log(`Minimum Trading Quantity: ${symbolInfo.minTradingQty}`);
      console.log(`Quantity Step: ${symbolInfo.qtyStep}`);
    } else {
      console.error("Failed to fetch symbol information:", response.retMsg);
    }
  } catch (error) {
    console.error("Error fetching symbol information:", error.message);
  }
}

getMinimumQty("KASUSDT");
