import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth-routes";
import { sendError } from "./shared/src/utils/response-utils";
import connectDb from "./shared/src/config/db";
import cors from "cors";
import { initKafka } from "./utils/init-kafka";
import { logger } from "./shared/src/utils/winston-logger";

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(express.json());


app.use("/api/v1/auth", authRoutes);

(async () => {
    await initKafka();
})()

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    return sendError(res, { error: err });
})

app.listen(PORT, async () => {
    await connectDb(MONGODB_URI || "");
    logger.info("AUTH-SERVICE is running on PORT: 👤", PORT);
})