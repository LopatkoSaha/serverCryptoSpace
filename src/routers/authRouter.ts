import bcrypt from "bcrypt";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jsonExpiresIn, jsonSecretKey } from "../../config/config";
import { actualCoins } from "../actualCoins";
import { Portfolio } from "../dbModels/Portfolio";
import { User } from "../dbModels/User";

const router = express.Router();
router.post("/login", async (req: any, res: any, next: any) => {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if (!user) {
        return res.status(404).json({message: "user is not"});
      }
      if (typeof user.password !== "string") {
        return new Error("Password type is a not string");
      }
      const isPassValid = bcrypt.compareSync(password, user.password );

      if (!isPassValid) {
        return res.status(400).json({message: "Invalid password"});
      }
      const token = jwt.sign({id: user.id, email: user.email}, jsonSecretKey, {expiresIn: jsonExpiresIn});
      return res.json({
        name: user.name,
        token,
      });
    } catch (err) {
      const customError = new Error("Login Error");
      customError.name = "LoginError";
      next(customError);
    }
  },
);

router.post("/registration", async (req: any, res: any, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const candidate = await User.findOne({email});
      if (candidate) {
        return res.status(400).json({message: `User with email ${email} already exist`});
      }
      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({
        email,
        name,
        password: hashPassword,
      });
      await user.save();

      const coins: Record<string, any> = {};
      actualCoins.forEach((item) => {
        coins[item] = 0;
      });

      const portfolio = new Portfolio({
        USD: 1000,
        coins,
        userId: user._id,
      });
      await portfolio.save();

      res.json({message: "User was created"});
    } catch (err) {
      const customError = new Error("RegistrationError");
      customError.name = "RegistrationError";
      next(customError);
    }
  },
);

export default router;