import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth-routes";
import connectDb from "@shared/src/config/db";
import { sendError } from "@shared/src/utils/response-utils";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());


app.use("/api/v1/auth", authRoutes);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    return sendError(res, { error: err });
})


app.listen(PORT, async () => {
    await connectDb(MONGODB_URI || "");
    console.log("Server running on port 4000...")
})