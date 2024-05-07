import express, { NextFunction } from "express";

import { actualCoins, coinsIcon } from "../actualCoins";
import {  ActualCoinsError } from "../errors/errors";
import { User } from "../dbModels/User";



const router = express.Router();

router.post("/", async (req: any, res: any, next: NextFunction) => {
    try {
      res.json({actualCoins, coinsIcon});
    } catch (err) {
      console.log("err=", err);
      next(new ActualCoinsError("Actual Coins Error"));
    }
  },
);

export default router;
