import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { logger, sendError } from "./shared";
import cors from "cors";
import productivityTimerRoutes from "./routes";
import connectDb from "./shared/config/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

app.use(cors({
    origin:"http://localhost:5173" ,
    credentials:true ,
    methods:["GET" , "POST" , "PUT" , "DELETE" , "PATCH"]
}));

app.use("/api/v1/productivity-timer", productivityTimerRoutes);

app.use((err: any, req: Request, res: Response) => {
    return sendError(res , {error:err});
})

app.listen(PORT, async () => {
    await connectDb(process.env.MONGODB_URI || "");
    logger.info(`Productivity timer is running on port: ⏰ ${PORT}`);
})