import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import morgan from "morgan"
import { Express } from "express"
import { PrismaClient } from "@prisma/client"
import gadgetRoutes from "./routers/gadget.route.js"
import authRoutes from "./routers/auth.route.js"
import cookieparser from "cookie-parser"


dotenv.config({path:"./.env"});

const port = Number(process.env.PORT) || 8000;
const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";

const app:Express = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cookieparser());

app.use(cors({
    origin:"*",
    credentials:true
}));
app.use(morgan('dev'))

export const prismaClient = new PrismaClient({});

app.use("/auth",authRoutes);
app.use("/gadgets",gadgetRoutes);

app.listen(port,()=>{
    console.log(`App is listening at port ${port} and in ${envMode} mode`);
})