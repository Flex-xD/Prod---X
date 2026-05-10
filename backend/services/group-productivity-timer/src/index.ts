import express , {Request , Response , NextFunction} from "express";
import dotenv from "dotenv";
import { logger, sendError } from "./shared";
import initKafka from "./utils/inti-kafka";
import { createServer } from "http";
import { Server } from "socket.io";
import groupTimerRouter from "./routes";
import { initSocket } from "./socket";
import cors from "cors";
import connectDb from "./shared/config/db";

dotenv.config();

const app = express();
// ? const server = createServer(app);
const PORT = process.env.PORT || 9000

app.use(express.json());

// ? const io = initSocket(server);

// io.on("connection", (socket: any) => {
//     console.log(`User connected 🔗: ${socket.id}`)
//     // socket.emit("coding" , () => {
//     //     const techStack = {
//     //         skills:["javascript" , "python"] ,
//     //         name:"Muskan Yadav" , 
//     //         aga:44 , 
//     //         experience:3
//     //     }
//     //     return techStack;
//     // })
// })

app.use(cors({
    origin:"http://localhost:5173" ,
    credentials:true ,
    methods:["GET" , "POST" , "PUT" , "DELETE" , "PATCH"]
}));

app.use("/api/v1/group-productivity-timer", groupTimerRouter)

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    return sendError(res, { error: err });
})

app.listen(PORT, async () => {
    await connectDb(process.env.MONGODB_URI || "")
    logger.info(`Group 👥 Productivity Timer Service is running on PORT: ✅ ${PORT}`);
    await initKafka();
});