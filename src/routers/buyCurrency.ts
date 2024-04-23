import express, { NextFunction, Request, Response, Router } from "express";

import { Coins } from "../dbModels/Coins";
import { Portfolio } from "../dbModels/Portfolio";
import { BuyAllInError, DataPortfolioError, ValidationError, BuyCurrencyError } from "../errors/errors";
import { allCurrency } from "../actualCoins";

const router = express.Router();

const validatorBuyAllIn = (req: any) => {
  const errors = [];
  const {buyFrom, buyTo} = req.body;
  
  if (!allCurrency.includes(buyFrom)) {
      errors.push(`Field buyFrom has invalid value is: ${buyFrom}`);
  }
  if (!allCurrency.includes(buyTo)) {
      errors.push(`Field buyTo has invalid value is: ${buyTo}`);
  }
  return errors;
};


router.post("/buy", async (req: any, res: any, next: NextFunction) => {
  const errors = validatorBuyAllIn(req);
  if (errors.length  !== 0) {
      return  next(new ValidationError(errors.join(", ")));
  }
    try {
      const userId = req.body.user.id;
      const potfolioUser: Record<string, any> | null = await Portfolio.findOne({userId});
      if (potfolioUser === null) {
        return next(new DataPortfolioError("No user portfolio"));
    }
      const lastCourse = await Coins.find().sort({createdDate: 1});
      const currentCourse: Record<string, any> = lastCourse[lastCourse.length - 1];
      currentCourse.USD = 1;
      const {buyFrom, buyTo, quantity} = req.body;
      if(potfolioUser.coins[buyFrom] < currentCourse[buyTo] * +quantity/currentCourse[buyFrom]) {
        res.json(`You short on ${buyFrom} for transaction `)
        return
      }

      await Portfolio.updateOne({_id: potfolioUser._id}, {
          coins: {
              ...potfolioUser.coins,
              [buyFrom]: (potfolioUser.coins[buyFrom] - (+quantity * currentCourse[buyTo] / currentCourse[buyFrom])).toFixed(2),
              [buyTo]: potfolioUser.coins[buyTo] + +quantity,
          },
      });
      res.json(`Operation was a success, was been buyed ${quantity} ${buyTo} for ${(+quantity * currentCourse[buyTo] / currentCourse[buyFrom]).toFixed(2)} ${buyFrom}`);
    } catch (err) {
      console.log("err=", err);
      next(new BuyCurrencyError("Buy Currency Error"));
    }
  },
);


router.post('/buyAllIn', async (req: any, res: any, next: NextFunction) => {
  const errors = validatorBuyAllIn(req);
  if (errors.length  !== 0) {
      return  next(new ValidationError(errors.join(", ")));
  }
  try {
          const userId = req.body.user.id;
          const potfolioUser: Record<string, any> | null = await Portfolio.findOne({userId}, {coins: 1, _id: 1});
          if (potfolioUser === null) {
              return next(new DataPortfolioError("No user portfolio"));
          }
          const courseToSort = await Coins.find().sort({createdDate: 1});
          const currentCourse: Record<string, number> = courseToSort[courseToSort.length - 1];
          currentCourse.USD = 1;

          const {buyFrom, buyTo} = req.body;
          await Portfolio.updateOne({_id: potfolioUser._id}, {
              coins: {
                  ...potfolioUser.coins,
                  [buyTo]: (potfolioUser.coins[buyTo] +  (potfolioUser.coins[buyFrom] * currentCourse[buyFrom]) / currentCourse[buyTo]).toFixed(2),
                  [buyFrom]: 0,
                },
          });
          res.json(`Operation was a success, was been buyed ${(potfolioUser.coins[buyFrom] * currentCourse[buyFrom] / currentCourse[buyTo]).toFixed(2)} ${buyTo} for all ${buyFrom}`);
      } catch (err) {
          console.log("err=", err);
          next(new BuyAllInError("Buy all in Error"));
      }
  },
);

export default router;
