import WebSocket from "ws";
import { placeOrder } from "../place-order/placeOrder.js";

export const connectWebSocket = (
  symbol,
  side,
  initialQuantity,
  stepPercentage
) => {
  const ws = new WebSocket("wss://stream.bybit.com/v5/public/linear");

  let initialPrice = null;
  let currentROI = 0;

  ws.on("open", () => {
    console.log(`Connected to WebSocket for ${symbol}`);
    ws.send(
      JSON.stringify({
        op: "subscribe",
        args: [`kline.1.${symbol}`], // מנוי לנתוני Kline ברזולוציה של דקה אחת
      })
    );
  });

  ws.on("message", async (data) => {
    // console.log("Raw WebSocket message:", data); // הדפסה של כל ההודעה
    const response = JSON.parse(data);
    // console.log("Parsed WebSocket message:", response); // הדפסה לאחר פענוח

    // בדיקה אם ההודעה מכילה מידע רלוונטי
    if (response.topic && response.topic.includes("kline")) {
      // console.log("Ticker message received:", response); // וידוא שהתגובה כוללת נתוני טיקר
      const tickerData = response.data?.[0];
      // console.log("Ticker data:", tickerData); // הדפסה של הנתונים הפנימיים

      const { close } = response.data[0]; // מחיר סגירה מעודכן
      const currentPrice = parseFloat(close);

      if (!initialPrice) {
        initialPrice = currentPrice; // מחיר התחלתי לפתיחה
        console.log(`Initial price set to ${initialPrice}`);
        return;
      }

      // חישוב ROI
      currentROI = ((currentPrice - initialPrice) / initialPrice) * 100;

      console.log(
        `Currency: ${symbol} Current price: ${currentPrice}, ROI: ${currentROI.toFixed(
          2
        )}%`
      );

      // בדיקת תנאי לקנייה נוספת
      if (Math.abs(currentROI) >= stepPercentage) {
        console.log(
          `ROI changed by ${stepPercentage}% - placing additional order.`
        );
        const orderQuantity = initialQuantity * 0.5; // לדוגמה: קנייה נוספת של 50% מהכמות
        await placeOrder(symbol, side, orderQuantity, currentPrice);

        // עדכון מחיר התחלה לאחר הקנייה הנוספת
        initialPrice = currentPrice;
      }
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};
