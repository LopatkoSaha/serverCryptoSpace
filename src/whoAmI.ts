import express from 'express';
import { NextFunction } from 'express';

const router = express.Router();
//@ts-ignore
router.post('/',
    async (req: any, res: any, next: NextFunction) => {
        try{
            const {user} = req.body;
            res.json(user);
        } catch (err) {
            const customError = new Error('History curs Error');
            customError.name = 'HistoryCursError';
            next(customError)
        }
    }
)

export default router;