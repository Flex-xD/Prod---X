import { Server } from "socket.io";
import { emitEvent, logger } from "../../shared";
import { IAuthedSocket } from "../../middleware";
import { markUserOnline, scheduleUserOffline } from "../user-status-store";


const registerConnectionHandlers = async (io: Server) => {
    io.on("connection", (socket: IAuthedSocket) => {

        const userId = socket.userId!;
        console.log(`user:${userId}`);
        socket.join(`user:${userId}`);

        markUserOnline(userId);
        const payload = { isOnline: true, userId }
        io.emit("user-status-changes", payload)
        emitEvent("user.status.online", payload);
        // io.emit("user-status-changes", () => {

        // })


        logger.info(`✅ socket connected --> userId:${userId} , socketId:${socket.id}`);

        socket.on("disconnect", (reason: string) => {
            logger.info(`🔌 socket disconnected --> userId:${userId} , reason:${reason}`);
            scheduleUserOffline(userId, () => {
                const payload = { userId, isOnline: false, lastSeen: new Date() };
                io.emit("user-status-changes", payload);
                emitEvent("user.status.offline", payload);
                logger.info("user-status-changes and user.status.offline are emitted !");
            })
        })
    });

};

export default registerConnectionHandlers;