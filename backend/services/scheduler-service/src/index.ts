import express from "express";
import dotenv from "dotenv";
import { logger } from "./shared";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

app.listen(PORT , () => {
    logger.info(`Scheduler Service is running on port: ⏰ ${PORT}`);
})