import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { logger, sendError } from "./shared";
import { initKafka } from "./utils/kafka";
import authedSocketMiddleware from "./middleware";
import { createServer } from "http";
import { Server } from "socket.io";
import registerConnectionHandlers from "./socket/socket-handler";
dotenv.config();

const PORT = process.env.PORT || 11000;
const app = express();
const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
})

app.use(express.json());
app.use((err: any, req: Request, res: Response) => {
    return sendError(res, { error: err });
})

// ? Fix this error
app.use(authedSocketMiddleware);

registerConnectionHandlers(io);

server.listen(PORT, async () => {
    logger.info(`Socket-Gateway is running on PORT🔌 : ${PORT}`);
    await initKafka();
})