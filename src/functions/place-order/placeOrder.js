import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";
import { checkSymbolExists } from "./checkSymbolExists.js";
dotenv.config();

const client = new RestClientV5({
  testnet: true,
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
});

export const placeOrder = async () => {
  // const getInstrumentInfo = async () => {
  //   const response = await client.getInstrumentsInfo({ category: "linear" });
  //   console.log(JSON.stringify(response, null, 2)); // הצגת כל המידע על הסמלים
  // };

  // const isSymbolExists = checkSymbolExists("BTCUSDT");
  // if (!isSymbolExists) {
  //   return console.log(`Symbol dosent exist`);
  // }
  // const checkBalance = async () => {
  //   const response = await client.getWalletBalance({ accountType: "UNIFIED" });
  //   console.log("Wallet Balance:", JSON.stringify(response, null, 2));
  // };

  // checkBalance();
  // return;
  try {
    const payload = {
      category: "linear", // עבור חוזים מתמשכים
      symbol: "BTCUSDT", // סמל תקין
      side: "Buy", // Buy או Sell
      orderType: "Market", // סוג הזמנה
      qty: "0.006", // כמות חוקית (0.001 או יותר)
      timeInForce: "GTC", // זמן ביצוע
    };
    console.log(
      "Sending order with payload:",
      JSON.stringify(payload, null, 2)
    );

    const response = await client.submitOrder(payload);
    console.log("Full API Response:", JSON.stringify(response, null, 2));

    if (response.retCode === 0) {
      console.log("Order placed successfully:", response.result);
    } else {
      console.error("Order failed:", response.retMsg);
    }
  } catch (error) {
    console.error("Error placing order:", error.message);
  }
};
