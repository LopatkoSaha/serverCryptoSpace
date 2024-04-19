import express from 'express';
import bcrypt from 'bcrypt';
import {User} from './dbModels/User';
import {Portfolio} from './dbModels/Portfolio';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import {actualCoins} from './actualCoins';

const router = express.Router();
export const secretKey = 'sekret-key';
//@ts-ignore
router.post('/login',
    async (req: any, res: any, next: NextFunction) => {        
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if (!user) {
                return res.status(404).json({message: 'user is not'})
            }else{
                if (typeof user.password !== 'string'){
                    return new Error('Password type is a not string')
                }
                const isPassValid = bcrypt.compareSync(password, user.password );
                
                if (!isPassValid) {
                    return res.status(400).json({message: 'Invalid password'})
                }
                const token = jwt.sign({id: user.id, email: user.email,}, secretKey, {expiresIn: '24h'});
                return res.json({
                    name: user.name,
                    token,
                })
            }
        } catch (err) {
            const customError = new Error('Login Error'); 
            customError.name = 'LoginError';
            next(customError)
        }
    }
)
//@ts-ignore
router.post('/registration',
    async (req: any, res: any, next: NextFunction) => {
        try{
            const {name, email, password} = req.body;
            
            const candidate = await User.findOne({email});
            if (candidate) {
                return res.status(400).json({message: `User with email ${email} already exist`})
            }
            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({
                name,
                email,
                password: hashPassword,
            }); 
            await user.save();

            const coins: Record<string, number> = {};
            actualCoins.forEach((item) => {
                coins[item] = 0;
            })

            const portfolio = new Portfolio({
                userId: user._id,
                coins: {...coins, USD: 1000}
            });
            await portfolio.save();
            
            res.json({message: 'User was created'});
        } catch (err) {
            const customError = new Error('RegistrationError');
            customError.name = 'RegistrationError';
            next(customError)
        }
    }
)

export default router;