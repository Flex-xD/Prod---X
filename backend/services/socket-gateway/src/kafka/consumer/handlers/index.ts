import { Server } from "socket.io";
import { logger } from "../../../shared";
import { TEventInvitationNotificationCreated, TEventGroupTimerParticipantUpdated } from "./handler-types";


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

    // * Forward rank/participant changes to every participant's room so group
    // * timers update live instead of requiring a page reload.
    "group.timer.participant.updated": async (payload: TEventGroupTimerParticipantUpdated) => {
        logger.info("Event listened on : group.timer.participant.updated")
        if (!payload?.recipients?.length) return;
        for (const recipientId of payload.recipients) {
            io.to(`user:${recipientId}`).emit("group.timer.participant.updated", payload);
        }
    },
});