import express, { NextFunction, Request, Response } from "express";

import { Portfolio } from "../dbModels/Portfolio";
import {  DataPortfolioError } from "../errors/errors";

const router = express.Router();

router.post("/", async (req: any, res: any, next: NextFunction) => {
    try {
      const userId = req.body.user.id;
      const potfolioUser: Record<string, any> | null = await Portfolio.findOne({userId}, {USD: 1, coins: 1, _id: 0});
      res.json(potfolioUser);
    } catch (err) {
      console.log("err=", err);
      next(new DataPortfolioError("Data Portfolio Error"));
    }
  },
);

export default router;
