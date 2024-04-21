import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jsonSecretKey } from "../../config/config";

export async function checkAuthUser(req: any, res: any, next: NextFunction) {
  if (!req.body.token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(req.body.token, jsonSecretKey, (err: any, decoded: any) => {
    if (err) {
      return next(err);
    } else {
      req.body.user = {id: decoded.id};
      next();
    }
  });
}
