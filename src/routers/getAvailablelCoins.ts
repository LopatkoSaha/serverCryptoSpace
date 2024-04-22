import express from "express";
import { NextFunction } from "express";
import { actualCoins, coinsIcon } from "../actualCoins";

const router = express.Router();

router.post("/", async (req: any, res: any, next: NextFunction) => {
    try {
      res.json({actualCoins, coinsIcon});
    } catch (err) {
      const customError = new Error("Actual coins Error");
      customError.name = "ActualCoinsError";
      next(customError);
    }
  },
);

export default router;
