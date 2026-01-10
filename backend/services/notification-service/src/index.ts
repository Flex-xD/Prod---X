import express  , {Request , Response , NextFunction}from "express";
import dotenv from "dotenv";
import { initKafka } from "./utils/init-kafka";
import { sendError } from "./shared";
import notificationRouter from "./routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT  || 10000

app.use(express.json());


app.use("/api/v1/notification" , notificationRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    return sendError(res, { error: err });
})

app.listen(PORT , async () => {
    console.info(`Notification-Service 🔔 running on PORT : ✅${PORT}`);
    await initKafka();
})