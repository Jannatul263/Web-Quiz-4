import * as bcrypt from 'bcrypt';
import User from './user.model';
import { JwtService } from './jwt.service';
import { NextFunction, Request, Response } from "express";


export class UserService {
    constructor() { }
    static async createUser(data: { name: string; email: string; password: string; }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
                ...data, password: hashedPassword,
        });
        const { password, ...result } = user.toJSON();
        console.log(result);
        return result;
    }
    static async validateUser(email: string, password: string) {
        const user = await User.findOne({ email });
    
        if (!user) {
          throw new Error('Invalid credentials');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }
    
        const { password: _, ...result } = user.toJSON();
        return result;
      }
    
      static async login(user: any) {
        const payload = { _id: user._id, email: user.email, sub: user._id, role: user.role };
        return {
          access_token: await JwtService.signToken(payload, process.env.JWT_SECRET as string, 3600 * 24),
        };
      }

      static async findById(id: string) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const { password, ...result } = user.toJSON();
        return result;
      }

      /* Middlewares */
      static async checkUser(req:Request, res:Response, next:NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        try {
            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            res.locals.user = payload;
            console.log(payload);
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    
    static async checkAdmin(req:Request, res:Response, next:NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        try {
            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            if (payload.role !== 'admin') {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            res.locals.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
    }
    static async checkUserOrAdmin(req:Request, res:Response, next:NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        try {
            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            if (payload.role !== 'admin' && payload.id !== req.params.id) {
                res.status(403).json({ message: 'Forbidden' });
              return;
          }
            res.locals.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
            return
        }
    }
}