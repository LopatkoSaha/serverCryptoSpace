import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { NextFunction } from 'express';
import { checkAuthUser } from './authMiddleware';
import authRouter from './authRouter';
import whoAmI from './whoAmI';
import getStatisticsCurs from './getStatisticsCurs';
//@ts-ignore
import expressWs from "express-ws";
import {changeCoinsCurse} from './changeCoinsCurse';
import getAvailablelCoins from './getAvailablelCoins';
import buyCurrency from './buyCurrency';
import getDataPortfolio from './getDataPortfolio';


const PORT = 4500;
const app = express();
expressWs(app);
import webSocketRouter from './webSocketRouter';
const db = 'mongodb+srv://lopatko:123ewqqwe321@lopatko.pmwti90.mongodb.net/?retryWrites=true&w=majority';

(async () => {
    try {
        await mongoose.connect(db);
        console.log('Connected to database');
    } catch (err) {
        console.error(err);
    }

    app.use(express.static(path.resolve(__dirname, 'build')));
    app.use(express.json());
    app.use(cors());
    app.use((req: any, res: any, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use('/auth', authRouter);
    app.use('/whoAmI', checkAuthUser, whoAmI);
    app.use('/connectWS', webSocketRouter);
    app.use('/statisticsCurs', getStatisticsCurs);
    app.use('/availableCoins', getAvailablelCoins);
    app.use('/buyCurrency', checkAuthUser, buyCurrency);
    app.use('/dataPortfolio', checkAuthUser, getDataPortfolio);

    app.use((err: any, req: any, res: any)=>{
        switch (err.name) {
            case 'JsonWebTokenError':
                return  res?.status(402).json(err.message)
            case 'TokenExpiredError':
                return  res.status(403).json(err.message)
            case 'RegistrationError':
                return  res.status(407).json(err.message)
            case 'LoginError':
                return  res.status(408).json(err.message)
            case 'WhoAmIError':
                return  res.status(409).json(err.message)
            case 'buyCurrencyError':
                return  res.status(410).json(err.message)
            case 'statisticsCursError':
                return  res.status(411).json(err.message)
            case 'ActualCoinsError':
                return  res.status(412).json(err.message)
            case 'DataPortfolioError':
                return  res.status(414).json(err.message)
            default: res.status(500).json('unknown error')
        }
    });
    changeCoinsCurse();
    app.listen(PORT, () => {
        console.log(`Listening port ${PORT}`);
    });
})();
