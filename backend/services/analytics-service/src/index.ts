import express from "express";
import dotenv from "dotenv";
import { logger } from "./shared";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =  process.env.MONGODB_URI


app.listen(PORT  , async () => {
    logger.info(`Analytics-Service 📊 is running on PORT:☑️  ${PORT}`);
})