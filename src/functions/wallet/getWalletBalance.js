import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const baseURL = "https://api.bybit.com"; // Mainnet בלבד

// פונקציה ליצירת חתימה
const createSignature = (params, secret) => {
  const signData = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHmac("sha256", secret).update(signData).digest("hex");
};

// פונקציה לשליפת יתרת הארנק
export const getWalletBalance = async () => {
  const apiKey = process.env.BYBIT_API_KEY;
  const apiSecret = process.env.BYBIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "API Key or Secret is missing. Please check your .env file."
    );
  }

  try {
    // שליפת זמן מדויק מהשרת
    const serverTimeResponse = await axios.get(`${baseURL}/v5/market/time`);
    const serverTime = serverTimeResponse.data.result.timeSecond * 1000; // זמן ב-milliseconds

    const params = {
      accountType: "UNIFIED", // סוג החשבון
      timestamp: serverTime, // זמן מדויק מהשרת
      recv_window: 120000, // חלון זמן רחב (120 שניות)
      api_key: apiKey, // המפתח
    };

    // יצירת חתימה
    const signature = createSignature(params, apiSecret);
    params.sign = signature;

    // קריאה ל-Wallet Balance
    const response = await axios.get(`${baseURL}/v5/account/wallet-balance`, {
      params,
    });

    console.log("Wallet Balance:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "Error fetching wallet balance:",
      error?.response?.data || error.message
    );
  }
};
