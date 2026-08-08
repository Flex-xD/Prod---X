import { Server, Socket } from "socket.io";
import { logger } from "../../shared";
import { IAuthedSocket } from "../../middleware";


const registerConnectionHandlers = (io: Server) => {
    io.on("connection", (socket: IAuthedSocket) => {
        const userId = socket.userId!;
        socket.join(`user:${userId}`);

        logger.info(`✅ socket connected --> userId:${userId} , socketId:${socket.id}`);

        socket.on("disconnect", (reason:string) => {
            logger.info(`🔌 socket disconnected --> userId:${userId} , reason:${reason}`);

        });

        socket.emit("connected", { userId });
    });
};

export default registerConnectionHandlers;