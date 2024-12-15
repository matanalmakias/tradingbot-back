import { model } from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: String,
  phone: Schema.Types.Mixed,
  verificationCode: Number,
  address: {
    city: String,
    street: String,
    apartNumber: Number,
    floor: Number,
    buildingCode: String,
  },
  roles: [String],
  registerValidation: Boolean,
  createdAt: { type: Date, default: Date.now() },
});

const User = model("User", userSchema);

export { User };
