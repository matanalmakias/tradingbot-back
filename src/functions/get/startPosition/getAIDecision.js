// functions/get/startPosition/getAIDecision.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getAIDecision = async (
  symbol,
  currentPrice,
  roi,
  initialPrice,
  positionSize = null,
  qtyToSell
) => {
  const prompt = `
 אתה עוזר מסחר חכם. הנה המידע העדכני למטבע ${symbol}:
    - מחיר נוכחי: ${currentPrice} USDT
    - מחיר התחלתי: ${initialPrice} USDT
    - שיעור רווח נוכחי (ROI): ${roi.toFixed(2)}%
    כמות מטבעות - ${positionSize}

  החלטה: האם כדאי לבצע קנייה (BUY), מכירה (SELL), או לא לעשות כלום (HOLD)?  
אם אתה עונה למכור לא כל המטבעות ימכרו אלא חלק , 
אני מעדיף שתענה שכן כי אז הבוט יתחיל למכור והרווחים יתחילו להיכנס, 
מלכתחילה הגדרתי אחוז שאני רוצה להתחיל למכור , אל תדאג מבין כל המטבעות,
ימכרו רק חלק קטן, וההודעה הזאת תחזור על עצמה כמה פעמים לבקש ממך
למכור עוד, אני רואה שהמודל הזה gpt3turbo הוא קשוח כזה,
אתה תמיד אומר לי hold , היה פעם שהייתי ב18 אחוז בביטקויין,
ואמרת לי לא וזה לא היה טוב, שים לב לכמות הדולרים ששמתי לכמות הדולרים שאני יכול להרוויח, אני אקרא לך
כל 24 שניות, אתה תחליט אם למכור כמות מטבעות קטנה מאד כל פעם ימכרו אם תחליט שכן - ${qtyToSell} מטבעות

  החזר תשובה בפורמט JSON: {"decision": "buy"} או
   {"decision": "sell"} או {"decision": "hold"}.
    אנא החזר תשובה אך ורק בformat json`;

  try {
    console.log("About to call AI for decision...");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // השתמש במודל זה במקום gpt-4
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });
    const aiResponse = JSON.parse(
      response.choices[0]?.message?.content || "{}"
    );

    console.log(`AI Response: ${JSON.stringify(aiResponse.decision)}`);
    return aiResponse.decision || "hold";
  } catch (error) {
    console.error("Error with AI decision:", error.message);
    return "hold"; // fallback ל-HOLD במקרה של כשל
  }
};
