import { Server } from "socket.io";
import { logger } from "../../../shared";
import { TEventInvitationNotificationCreated } from "./handler-types";


export const createHandlers = (io:Server) =>  ({
    "invitation.notification.created": async ({ username, notification}: TEventInvitationNotificationCreated) => {
        // ? Convert the userID to mongoose.Object ID
        logger.info("Event listened on : invitation.notification.created")
        for (const invitedUser of notification.to) {
            // ? check weather io is connected or not
            io.to(`user:${invitedUser}`).emit("invitation-notification" , {
                notification ,
                username
            });
        };
    },
});