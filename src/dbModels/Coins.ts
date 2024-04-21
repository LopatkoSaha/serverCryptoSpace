import mongoose, { Schema } from "mongoose";
import { actualCoins } from "../actualCoins";

export const modelCoins: Record<string, any> = { createdDate: { type: Date, required: true } };
actualCoins.forEach((item) => {
  modelCoins[item] = { type: Number, required: true };
});

export const Coins = mongoose.model("Coins", new Schema(modelCoins));
