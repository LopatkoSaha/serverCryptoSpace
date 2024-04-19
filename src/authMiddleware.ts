import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { secretKey } from './authRouter'



export async function checkAuthUser(req: any, res: any, next: NextFunction) {
    if (!req.headers.token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(req.headers.token, secretKey, (err: any, decoded: any) => {
        if (err) {
            return next(err);
        } else {
            req.body.user = {id: decoded.id}
            next();
        } 
    });
}
