import express from "express";
import dotenv from "dotenv";
import { initKafka } from "./utils/init-kafka";
dotenv.config();

const app = express();
const PORT = process.env.PORT  || 10000

app.listen(PORT , async () => {
    console.info(`Notification-Service 🔔 running on PORT : ✅${PORT}`);
    await initKafka();
})