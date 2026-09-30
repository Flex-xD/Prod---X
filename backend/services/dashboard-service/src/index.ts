import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sendError } from "./shared";
import dashboardRouter from "./routes";
import connectDb from "./shared/config/db";
import { initKafka } from "./utils/init-kafka";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use("/api/v1/dashboard", dashboardRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    return sendError(res, { error: err });
});

app.listen(PORT, async () => {
    await connectDb(process.env.MONGODB_URI || "");
    console.info(`Dashboard-Service 📊 running on PORT : ✅${PORT}`);
    await initKafka();
});