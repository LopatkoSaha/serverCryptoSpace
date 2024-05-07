import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";

import { allowOrigin, appPort, mongoURI } from "../config/config";
import { changeCoinsCurse } from "./helpers/changeCoinsCurse";
import { checkAuthUser } from "./middlewares/authMiddleware";
import authRouter from "./routers/authRouter";
import buyCurrency from "./routers/buyCurrency";
import getAvailablelCoins from "./routers/getAvailablelCoins";
import getDataPortfolio from "./routers/getDataPortfolio";
import getStatisticsCurs from "./routers/getStatisticsCurs";
import whoAmI from "./routers/whoAmI";
import quantityUsers from "./routers/quantityUsers";
import bestCourses from "./routers/bestCourses";
import "./webSocketServer";

const app = express();

app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json());
app.use(cors({
    allowedHeaders: "*",
    origin: allowOrigin,
}));
app.use("/auth", authRouter);
app.use("/whoAmI", checkAuthUser, whoAmI);
app.use("/statisticsCurs", getStatisticsCurs);
app.use("/availableCoins", getAvailablelCoins);
app.use("/buyCurrency", checkAuthUser, buyCurrency);
app.use("/portfolio", checkAuthUser, getDataPortfolio);
app.use("/quantityUsers", quantityUsers);
app.use("/bestCourses", bestCourses);

app.use((err: any, req: any, res: any, next: any) => {

    switch (err.errName) {
        case "TokenExpiredError":
            return  res.status(403).json(err);
        case "JsonWebTokenError":
            return  res.status(405).json(err);
        case "RegistrationError":
            return  res.status(406).json(err.message);
        case "LoginError":
            return  res.status(407).json(err.message);
        case "BuyCurrencyError":
            return  res.status(408).json(err.message);
        case "BuyAllInError":
            return  res.status(409).json(err.message);
        case "ActualCoinsError":
            return  res.status(410).json(err.message);
        case "DataPortfolioError":
            return  res.status(411).json(err.message);
        case "StatisticsCursError":
            return  res.status(412).json(err.message);
        case "WhoAmIError":
            return  res.status(414).json(err.message);
        case "QuantityUsersError":
            return  res.status(415).json(err.message);
        case "BestCoursesError":
            return  res.status(415).json(err.message);
        default: res.status(500).json("unknown error");
    }
});

(async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to database");
    } catch (err) {
        console.error(err);
    }
    changeCoinsCurse();
    app.listen(appPort, () => {
        console.log(`Listening port ${appPort}`);
    });
})();
