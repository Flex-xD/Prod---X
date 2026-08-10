import { Socket } from "socket.io";
import { io } from "../../..";
import { logger } from "../../../shared";
import { TEventInvitationNotificationCreated } from "./handler-types";


export const handlers = {
    "invitation.notification.created": async ({ username, notifcation}: TEventInvitationNotificationCreated) => {
        // ? Convert the userID to mongoose.Object ID
        for (const invitedUser of notifcation.to) {
            // ? check weather io is connected or not
            io.to(`userId:${invitedUser}`).emit("invitation-notification" , {
                notifcation ,
                username
            });
        };
    },
}