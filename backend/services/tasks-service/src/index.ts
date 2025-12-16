import express , {Request , Response , NextFunction} from "express";
import dotenv from "dotenv";
import { logger, sendError } from "./shared";
import connectDb from "./shared/config/db";
import cors from "cors";
import taskRoutes from "./routes/task-route";
import initKafka from "./utils/init-kafka";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI =  process.env.MONGODB_URI

app.use(cors({
    origin:"http://localhost:5173" ,
    credentials:true ,
    methods:["GET" , "POST" , "PUT" , "DELETE" , "PATCH"]
}));

app.use(express.json());

app.use("/api/v1/tasks" , taskRoutes);

(async () => {
    await initKafka();
})()

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    return sendError(res, { error: err });
})

app.listen(PORT  , async () => {
    await connectDb(MONGODB_URI || "");
    logger.info(`Task-Service is running on PORT:☑️  ${PORT}`);
})