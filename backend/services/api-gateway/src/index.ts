import dotenv from "dotenv";
import connectDb from "../../../shared/config/db"; // ✅ 3 levels up to shared/config/db
import { sendError } from "../../../shared/utils/response-utils";
import express, { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return sendError(res, { error: err });
})

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    connectDb(MONGODB_URI || "");
    console.log("Server running on port 4000...")
})