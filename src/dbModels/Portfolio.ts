import mongoose, { Schema } from 'mongoose';
import {allCurrency} from '../actualCoins';

const coins: Record<string, any> = {};
allCurrency.forEach((item) => {
    coins[item] = Number
})

const potfolioSchema = new Schema({
    userId: String,
    coins,
});

export const Portfolio = mongoose.model('Portfolio', potfolioSchema);