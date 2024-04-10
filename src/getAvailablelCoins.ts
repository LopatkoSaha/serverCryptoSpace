import {actualCoins, coinsIcon} from './actualCoins';
import express from 'express';
import { NextFunction } from 'express';

const router = express.Router();
//@ts-ignore
router.post('/',
    async (req: any, res: any, next: NextFunction) => {
        try{
            res.json({actualCoins, coinsIcon});
        } catch (err) {
            const customError = new Error('Actual coins Error');
            customError.name = 'ActualCoinsError';
            next(customError)
        }
    }
)

export default router;