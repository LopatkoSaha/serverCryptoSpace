import mongoose, { Schema } from 'mongoose';
import {actualCoins} from '../actualCoins';

const coins: Record<string, any> = {};
actualCoins.forEach((item) => {
    coins[item] = Number
})

const potfolioSchema = new Schema({
    userId: String,
    USD: Number,
    coins: coins
});

export const Portfolio = mongoose.model('Portfolio', potfolioSchema);