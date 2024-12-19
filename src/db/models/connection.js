import { model, Schema } from "mongoose";

const connectionSchema = new Schema({
  symbol: { type: String }, // המטבע הנסחר
  initialPrice: { type: Number }, // המחיר ההתחלתי
  buyCount: { type: Number, default: 0 }, // מספר הקניות שבוצעו
  lastPrice: { type: Number }, // המחיר האחרון שנקלט
  isBusy: { type: Boolean, default: false }, // האם תהליך פעיל
  createdAt: { type: Date, default: Date.now }, // תאריך יצירת החיבור
  updatedAt: { type: Date, default: Date.now }, // תאריך עדכון אחרון
});

connectionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Connection = model("Connection", connectionSchema);

export { Connection };
