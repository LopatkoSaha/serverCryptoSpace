import express, { NextFunction, Request, Response, Router } from 'express';
import {Portfolio} from "./dbModels/Portfolio";

const router = express.Router() as Router;

//@ts-ignore
router.post('/', async (req: any, res: any, next: NextFunction) => {
        try{
            const userId = req.body.user.id;
            const potfolioUser: Record<string, any> | null = await Portfolio.findOne({userId: userId}, {coins: 1, _id: 0});
            res.json(potfolioUser);
        } catch (err) {
            console.log('err=', err);
            const customError = new Error('DataPotrtfolio Error');
            customError.name = 'DataPotrtfolioError';
            next(customError)
        }
    }
)

export default router;