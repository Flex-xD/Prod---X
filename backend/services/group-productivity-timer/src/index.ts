import express from "express";
import dotenv from "dotenv";
import { logger } from "./shared";
import initKafka from "./utils/inti-kafka";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";
// import cors from "cors";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 9000


const io = initSocket(server);

io.on("connection", (socket: any) => {
    console.log(`User connected 🔗: ${socket.id}`)
    // socket.emit("coding" , () => {
    //     const techStack = {
    //         skills:["javascript" , "python"] ,
    //         name:"Muskan Yadav" , 
    //         aga:44 , 
    //         experience:3
    //     }
    //     return techStack;
    // })
})

server.listen(PORT, async () => {
    logger.info(`Group 👥 Productivity Timer Service is running on PORT: ✅ ${PORT}`);
    await initKafka();
});