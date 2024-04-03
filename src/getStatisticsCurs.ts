import { groupBy } from 'lodash';
import express, { NextFunction, Request, Response, Router } from 'express';
import {Coins} from "./dbModels/Coins";
import moment from 'moment';

const router = express.Router() as Router;

const unit: Record<string, number> = {
    ms: 1,
    sec: 1000,
    min: 60000,
    hour: 3600000,
    day: 3600000*24,
    week: 3600000*24,
    month: 3600000*24*4,
    year: 3600000*24*4*12,
}
//@ts-ignore
router.post('/', async (req: any, res: any, next: NextFunction) => {
        try{
            const {coin, from, to, precision} = req.body;

            const statistics = await Coins
                .find(
                    {createdDate :{ 
                            $gte: new Date(Date.now() - from), 
                            $lte: new Date(Date.now() - to)
                        }
                    },
                    {
                        [coin]: 1,
                        createdDate: 1,
                    }
                )
                .sort({createdDate: 1}
                    );
                    
            const sortedCursToPrecision: Array<Record<string, number | Date>> = [];
            let stepToSorted = 0;

            statistics.forEach((item, ind, arr) => {

                if(!arr[ind + 1]) {
                    sortedCursToPrecision.push(item);
                }
                else if(arr[ind + 1].createdDate.getTime() >= stepToSorted + unit[precision]) {
                    sortedCursToPrecision.push(item);
                    stepToSorted = item.createdDate.getTime();
                }
            })

            res.json(sortedCursToPrecision);
        } catch (err) {
            console.log('err=', err);
            
            const customError = new Error('statisticsCurs Error');
            customError.name = 'statisticsCursError';
            next(customError)
        }
    }
)

export default router;