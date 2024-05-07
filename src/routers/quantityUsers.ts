import express, { NextFunction } from "express";

import { QuantityUsersError } from "../errors/errors";
import { User } from "../dbModels/User";


const router = express.Router();

router.post("/", async (req: any, res: any, next: NextFunction) => {
        try {
            const quantity = await User.find();
            if(quantity.length > 0){
                res.json(quantity.length)
            }else{
            res.json(0);
            }
        } catch (err) {
            console.log("err=", err);
            next(new QuantityUsersError("Quantity Users Error"));
        }
    },
);

export default router;