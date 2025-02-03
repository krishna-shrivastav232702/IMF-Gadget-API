import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

interface AuthRequest extends Request{
    user?:any;
}

export const protect = async(req:AuthRequest,res:Response,next:NextFunction)=>{
    let token;
    if(req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET!);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({message:"Not authorized"});
            return;
        }
    }
    if(!token){
        res.status(400).json({ message: "no token" });
        return;
    }
}