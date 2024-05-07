import express, { NextFunction } from "express";

import { BestCoursesError } from "../errors/errors";
import { Coins } from "../dbModels/Coins";
import { actualCoins } from "../actualCoins";



const router = express.Router();

router.post("/", async (req: any, res: any, next: NextFunction) => {
        try {
            const timeFrame = 3600000 * 24;
            const coursesFrame = await Coins.find(
                {createdDate : {
                    $gte: new Date(Date.now() - timeFrame),
                    $lte: new Date(Date.now()),
                  },
                },
                {
                  _id: 0,
                },
              )
              .sort({createdDate: 1},
              );
              const firstCourse = coursesFrame[0];
              const lastCourse = coursesFrame[coursesFrame.length-1];
            const bestCourse = actualCoins.map(item => {
                const dinamic = (100 * (lastCourse[item] - firstCourse[item]) / firstCourse[item]).toFixed(2);
                return {item, course: lastCourse[item], dinamic: +dinamic}
            }).sort((a, b) => b.dinamic - a.dinamic)
            res.json(bestCourse.slice(0, 4))
        } catch (err) {
            console.log("err=", err);
            next(new BestCoursesError("Best Courses Error"));
        }
    },
);

export default router;