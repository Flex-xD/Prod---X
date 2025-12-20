import express from "express";
import dotenv from "dotenv";
import { logger } from "./shared";
dotenv.config();

const app = express();
const PORT =  process.env.PORT ||9000


app.listen(PORT , () => {
    logger.info(`Group 👥 Productivity Timer Service is running on PORT: ✅ ${PORT}`);
})