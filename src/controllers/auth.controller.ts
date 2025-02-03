import { Request, Response } from "express"
import { prismaClient } from "../index.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(404).json({ message: "Enter all the fields" });
            return;
        }
        const userAlreadyExists = await prismaClient.user.findFirst({ where: { email } });
        if (userAlreadyExists) {
            res.status(400).json({ message: "User Already Exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const token = generateToken(res, user.id);
        res.status(201).json({
            message: "User created successfully",
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            },
            token
        });

    } catch (error) {
        console.error("something went wrong in the server");
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        const user = await prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User doesnt exist" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid Credentials" });
            return
        }
        const token = generateToken(res, user.id);
        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            },
            token
        })

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("token","",{
            httpOnly:true,
            expires: new Date(0)
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Error logging out" });
    }
}
