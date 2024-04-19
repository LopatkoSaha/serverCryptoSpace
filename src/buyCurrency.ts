import express, { NextFunction, Request, Response, Router } from 'express';
import {Portfolio} from "./dbModels/Portfolio";
import {Coins} from "./dbModels/Coins";

const router = express.Router() as Router;

//@ts-ignore
router.post('/', async (req: any, res: any, next: NextFunction) => {
        try{
            const {buyFrom, buyTo, quantity} = req.body;
            const userId = req.body.user.id;
            const potfolioUser: Record<string, any> | null = await Portfolio.findOne({userId: userId});
            const lastCourse = await Coins.find().sort({createdDate: 1});
            const currentCourse: Record<string, any> = lastCourse[lastCourse.length-1];
            // Buy currency for USD
            if(potfolioUser && buyFrom === 'USD' && currentCourse[buyTo]*quantity <= potfolioUser!.USD){
                potfolioUser!.USD = potfolioUser!.USD - currentCourse[buyTo]*quantity;
                potfolioUser!.coins[buyTo] = potfolioUser!.coins[buyTo] + quantity;
                const newPartfolio = new Portfolio(potfolioUser);
                newPartfolio.save();
                res.json(`Operation was a success, was been buyed ${quantity} ${buyTo} for ${currentCourse[buyTo]*quantity} ${buyFrom}`);
                return
            }
            // Buy USD for currency
            if(potfolioUser && buyTo === 'USD' && potfolioUser!.coins[buyFrom]*currentCourse[buyFrom] >= quantity){
                potfolioUser!.USD = potfolioUser!.USD + currentCourse[buyFrom]*quantity;
                potfolioUser!.coins[buyFrom] = potfolioUser!.coins[buyFrom] - quantity;
                const newPartfolio = new Portfolio(potfolioUser);
                newPartfolio.save();
                res.json(`Operation was a success, was been buyed ${quantity} ${buyFrom} for ${currentCourse[buyFrom]*quantity} ${buyTo}`);
                return
            }
            // Buy currency for currency
            if(potfolioUser!.coins[buyFrom]*currentCourse[buyFrom] >= currentCourse[buyTo]*quantity){
                potfolioUser!.coins[buyTo] = (potfolioUser!.coins[buyTo] + quantity).toFixed(2);
                potfolioUser!.coins[buyFrom] = (potfolioUser!.coins[buyFrom] - currentCourse[buyTo]*quantity/currentCourse[buyFrom]).toFixed(2); 
                const newPartfolio = new Portfolio(potfolioUser);
                newPartfolio.save();
                res.json(`Operation was a success, was been buyed ${quantity} ${buyTo} for ${(currentCourse[buyTo]*quantity/currentCourse[buyFrom]).toFixed(2)} ${buyFrom}`);
            }
            else{
                res.json('Currency value error');
            }
        } catch (err) {
            console.log('err=', err);
            const customError = new Error('buyCurrency Error');
            customError.name = 'buyCurrencyError';
            next(customError)
        }
    }
)

export default router;