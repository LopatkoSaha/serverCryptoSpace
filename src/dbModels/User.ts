import mongoose, { Schema } from 'mongoose';
import {actualCoins} from '../actualCoins';

const coins: Record<string, any> = {};
actualCoins.forEach((item) => {
    coins[item] = Number
})

const userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    coins: coins
});

export const User = mongoose.model('User', userSchema);
