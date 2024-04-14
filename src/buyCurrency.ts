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
            // Buy currency from USD
            if(potfolioUser!.USD  && buyFrom === 'USD' && currentCourse[buyTo]*quantity <= potfolioUser!.USD){
                potfolioUser!.USD = potfolioUser!.USD - currentCourse[buyTo]*quantity;
                potfolioUser!.coins[buyTo] = potfolioUser!.coins[buyTo] + quantity;
                const newPartfolio = new Portfolio(potfolioUser);
                newPartfolio.save();
                res.json({message: `Operation was a success, was been buyed ${quantity} ${buyTo} from ${currentCourse[buyTo]*quantity} ${buyFrom}`});
                return
            }
            // Buy USD from currency
            if(potfolioUser!.USD  && buyTo === 'USD' && currentCourse[buyFrom]*quantity <= potfolioUser!.USD){
                potfolioUser!.USD = potfolioUser!.USD + currentCourse[buyFrom]*quantity;
                potfolioUser!.coins[buyFrom] = potfolioUser!.coins[buyFrom] - quantity;
                const newPartfolio = new Portfolio(potfolioUser);
                newPartfolio.save();
                res.json({message: `Operation was a success, was been buyed ${quantity} ${buyFrom} from ${currentCourse[buyFrom]*quantity} ${buyTo}`});
                return
            }
            // Buy currency from currency
            if(potfolioUser!.coins[buyFrom]*currentCourse[buyFrom] >= currentCourse[buyTo]*quantity){
                potfolioUser!.coins[buyTo] = (potfolioUser!.coins[buyTo] + quantity).toFixed(2);
                potfolioUser!.coins[buyFrom] = (potfolioUser!.coins[buyFrom] - currentCourse[buyTo]*quantity/currentCourse[buyFrom]).toFixed(2); 
                const newPartfolio = new Portfolio(potfolioUser);
                newPartfolio.save();
                res.json({message: `Operation was a success, was been buyed ${quantity} ${buyTo} from ${(currentCourse[buyTo]*quantity/currentCourse[buyFrom]).toFixed(2)} ${buyFrom}`});
            }
            else{
                res.json({message: 'Currency value error'});
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