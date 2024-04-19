import express, { NextFunction, Request, Response, Router } from 'express';

import {Portfolio} from "./dbModels/Portfolio";
import {Coins} from "./dbModels/Coins";
import { DataPortfolioError, BuyAllInError, ValidationError } from './errors/errors';
import { allCurrency } from './actualCoins';

const router = express.Router() as Router;

const validatorBuyAllIn = (req: any) => {
    const errors = [];
    const {buyFrom, buyTo} = req.body;
    if(!allCurrency.includes(buyFrom)) {
        errors.push(`Field buyFrom has invalid value is: ${buyFrom}`)
    }
    if(!allCurrency.includes(buyTo)) {
        errors.push(`Field buyTo has invalid value is: ${buyTo}`)
    }
    return errors
}

//@ts-ignore
router.post('/', async (req: any, res: any, next: NextFunction) => {
    const errors = validatorBuyAllIn(req);
    if(errors.length !== 0){
        return next(errors.join(', '))
    }
        try{
            const userId = req.body.user.id;
            const potfolioUser: Record<string, any> | null = await Portfolio.findOne({userId: userId}, {coins: 1, _id: 1});
            if(potfolioUser === null){
                return next(new DataPortfolioError('No user portfolio'))
            }
            const lastCourse = await Coins.find().sort({createdDate: 1});
            const currentCourse: Record<string, any> = lastCourse[lastCourse.length-1];
            const {buyFrom, buyTo} = req.body;
            
            await Portfolio.updateOne({_id: potfolioUser._id}, {
                coins: {
                    ...potfolioUser.coins,
                    [buyFrom]: 0,
                    [buyTo]: 50,
                }
            })
            if(buyFrom !== 'USD' && !Object.keys(potfolioUser.coins).includes(buyFrom)){
                res.json('Currency name error');
                return
            }
            if(buyFrom === 'USD' && buyTo === 'USD'){
                res.json('Sorry, but Federal Reserve System USA did not sell USD for USD');
                return
            }
            if(buyFrom === 'USD' && potfolioUser.USD !== 0){
                potfolioUser.coins[buyTo] =  potfolioUser.coins[buyTo] + (potfolioUser.USD/currentCourse[buyTo]).toFixed(2);
                potfolioUser.USD = 0;
                const newPartfolio = new Portfolio(potfolioUser);
                // newPartfolio.save();
                res.json(`Operation was a success, was been buyed ${potfolioUser.coins[buyTo]} ${buyTo} for all ${buyFrom}`);
                return
            }
            if(buyTo === 'USD' && potfolioUser.coins[buyFrom] !== 0){
                potfolioUser.USD = (potfolioUser.coins[buyFrom]*currentCourse[buyFrom]).toFixed(2);
                potfolioUser.coins[buyFrom] = 0;
                const newPartfolio = new Portfolio(potfolioUser);
                // newPartfolio.save();
                res.json(`Operation was a success, was been buyed ${potfolioUser.USD} ${buyTo} for all ${buyFrom}`);
                return
            }
            if(potfolioUser.coins[buyFrom] !== 0){
                potfolioUser.coins[buyTo] = (currentCourse[buyTo]*(potfolioUser.coins[buyFrom]/currentCourse[buyFrom])).toFixed(2);
                potfolioUser.coins[buyFrom] = 0;
                const newPartfolio = new Portfolio(potfolioUser);
                // newPartfolio.save();
                res.json(`Operation was a success, was been buyed ${potfolioUser.coins[buyTo]} ${buyTo} for all ${buyFrom}`);
                return
            }else{
                res.json('Transaction is error');
            }
        } catch (err) {
            console.log('err=', err);
            next(new BuyAllInError('Buy all in Error'))
        }
    }
)

export default router;