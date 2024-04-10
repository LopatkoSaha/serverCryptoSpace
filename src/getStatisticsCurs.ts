import { groupBy } from 'lodash';
import express, { NextFunction, Request, Response, Router } from 'express';
import {Coins} from "./dbModels/Coins";
import moment from 'moment';

const router = express.Router() as Router;

const unit: Record<string, number> = {
    ms: 1,
    sec: 1000,
    min: 60000,
    hour: 3600000+600000,
    day: 86400000,
    week: 604800000,
    month: 2419200000,
    year: 29030400000,
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
                        _id: 0
                    }
                )
                .sort({createdDate: 1}
                    );

            const sortedCursToPrecision: Array<Record<string, number | Date>> = [];
            let stepToSorted = 0;

            statistics.forEach((item, ind, arr) => {
                if(!arr[ind + 1]) {
                    sortedCursToPrecision.push(arr[ind]);
                }
                else  
                if(arr[ind + 1].createdDate.getTime() > stepToSorted + unit[precision]) {
                    sortedCursToPrecision.push(arr[ind + 1]);
                    stepToSorted = arr[ind + 1].createdDate
                    .getTime();
                }
            })
            const currentDate = sortedCursToPrecision.map((item)=>{
                
                return {[coin]: item[coin], 
                    createdDate: moment(item.createdDate).format('lll'),
                };
            })
            res.json(currentDate);
        } catch (err) {
            console.log('err=', err);
            
            const customError = new Error('statisticsCurs Error');
            customError.name = 'statisticsCursError';
            next(customError)
        }
    }
)

export default router;