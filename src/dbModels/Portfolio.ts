import mongoose, { Schema } from "mongoose";
import { allCurrency } from "../actualCoins";

const coins: Record<string, any> = {};
allCurrency.forEach((item) => {
  coins[item] = Number;
});

const portfolioSchema = new Schema({
  coins,
  userId: String,
});

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
