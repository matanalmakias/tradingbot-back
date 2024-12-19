import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
dotenv.config();

const client = new RestClientV5({
  testnet: true, // ודא שאתה ב-Testnet
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const checkSymbolExists = async (symbol) => {
  try {
    const response = await client.getInstrumentsInfo({
      category: "linear",
      symbol,
    });

    // הצגת התשובה המלאה כדי להבין את המבנה שלה
    // console.log("Full response:", JSON.stringify(response, null, 2));

    // בדוק אם הסמל קיים ברשימה ובמצב "Trading"
    const symbolExists =
      response.result &&
      response.result.list &&
      response.result.list.some(
        (instrument) =>
          instrument.symbol === symbol && instrument.status === "Trading"
      );

    if (symbolExists) {
      console.log(`${symbol} is available for trading.`);
    } else {
      console.log(
        `${symbol} is not available for trading or it's in pre-launch.`
      );
    }
  } catch (error) {
    console.error("Error fetching instrument info:", error.message);
  }
};
