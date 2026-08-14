import { Server, Socket } from "socket.io";
import { emitEvent, logger } from "../../shared";
import { IAuthedSocket } from "../../middleware";
import { markUserOnline, scheduleUserOffline } from "../user-status-store";


const registerConnectionHandlers = async (io: Server) => {
    io.on("connection", (socket: IAuthedSocket) => {

        const userId = socket.userId!;
        console.log(`user:${userId}`);
        socket.join(`user:${userId}`);

        io.emit("user-status-changes", () => {
            markUserOnline(userId);
            emitEvent("user.status.online", { isOnline: true });
        })


        logger.info(`✅ socket connected --> userId:${userId} , socketId:${socket.id}`);

        socket.on("disconnect", (reason: string) => {
            logger.info(`🔌 socket disconnected --> userId:${userId} , reason:${reason}`);
            scheduleUserOffline(userId, () => {
                const payload = { userId, isOnline: false, lastSeen: new Date() };
                io.emit("user-status-changes" , payload);
                emitEvent("user.status.offline", payload);
            })
        })
    });

};

export default registerConnectionHandlers;