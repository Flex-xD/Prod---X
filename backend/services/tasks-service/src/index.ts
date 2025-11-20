import { logger } from "@shared/src/utils/winston-logger";
import express ,{Request , Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;


app.listen(PORT  , () => {
    logger.info(`Task-Service is running on PORT:☑️  ${PORT}`);
})