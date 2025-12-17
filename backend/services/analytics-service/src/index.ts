import express from "express";
import dotenv from "dotenv";
import { logger } from "./shared";
import { initKafka } from "./utils/init-kafka";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 7000;


(async () => {
    await initKafka();
})()

app.listen(PORT  , async () => {
    logger.info(`Analytics-Service 📊 is running on PORT:☑️  ${PORT}`);
})