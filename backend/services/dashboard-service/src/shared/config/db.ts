import mongoose from "mongoose";
import { logger } from "../utils/winston-logger";

const connectDb = async (mongoURI: string) => {
    try {
        if (!mongoURI) {
            return logger.error("MongoDB URI is not defined !");
        }
        const conn = await mongoose.connect(mongoURI);
        console.log("Connected to the DB ✅ :", conn.connection.host)
    } catch (error) {
        logger.error("Error while connecting to the DB : ", { error });
    }
}

export default connectDb;