import express, { NextFunction } from "express";

import { WhoAmIError } from "../errors/errors";


const router = express.Router();

router.post("/", async (req: any, res: any, next: NextFunction) => {
        try {
            const {user} = req.body;
            res.json(user);
        } catch (err) {
            console.log("err=", err);
            next(new WhoAmIError("Who Am I Error"));
        }
    },
);

export default router;
