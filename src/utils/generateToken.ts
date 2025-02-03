import jwt from "jsonwebtoken"
import { Response } from "express";
import dotenv from "dotenv"

dotenv.config();

export const generateToken = (res:Response,id:string):string => {
    const token = jwt.sign({id},process.env.JWT_SECRET || "defaultSecret", {
        expiresIn:'1d'
    });

    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "lax",
        maxAge:24*60*60*1000
    })
    return token;
}