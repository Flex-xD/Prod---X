import express from "express";
import dotenv from "dotenv";
import { logger } from "./shared";
import initKafka from "./utils/inti-kafka";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 9000


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on("connection", (socket: any) => {
    console.log(`User connected 🔗: ${socket.id}`)
})

server.listen(PORT, async () => {
    logger.info(`Group 👥 Productivity Timer Service is running on PORT: ✅ ${PORT}`);
    // await initKafka();
});