import mongoose, { Mongoose } from "mongoose"
import { TgroupProductivityTimerForConsumer } from ".."
import axios from "axios"
import { ApiError, getUser, logger, toObjectId } from "../../../shared";
import { StatusCodes } from "http-status-codes";
import { INotification } from "../../../model/Notification";
import { notificationServices } from "../../../service";
import { emitEvent } from "../../../kafka/producer";

type TEventGroupTimerCreated = {
    userId: string,
    invitedUsersId: string[],
    groupProductivityTimer: TgroupProductivityTimerForConsumer,
}

type TEventNotificationCreated = {
    notification: INotification,
}

export const handlers = {
    // ? This event is for initiating the create-notification API
    "group.timer.created": async ({ userId, groupProductivityTimer
    }: TEventGroupTimerCreated) => {
        try {
            logger.info("Sending API request to : /create-notification")
            const response = await axios.post(
                "http://localhost:3000/api/v1/notification/create-notification",
                {
                    to: groupProductivityTimer.invitedUsersId,
                    from: userId,
                    topic: `Invitation for Group-productivity-timer  :${groupProductivityTimer.title}`,
                    message: `You have been invited to a group-productivity-timer by ${groupProductivityTimer.author}`,
                    notificationType: "group-timer-request" , 
                    invitation: { groupTimerId: groupProductivityTimer._id, timerName: groupProductivityTimer.title }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-service-key": process.env.PRODX_SERVICE_KEY,
                    }
                }
            );
            logger.info(`EVENT:group.timer.created , RESPONSE:${response.data}`);

        } catch (err: any) {
            throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error while sending the request to the /create-notification API : ${err}`)
        }
    },

    // ? This event links the notification to every invited user and pushes the
    // * socket event that turns into the frontend toast + badge refresh.
    "notification.created": async ({ notification }: TEventNotificationCreated) => {
        logger.info("EVENT:notification.created -> linking recipients & notifying sockets");

        const recipients: mongoose.Types.ObjectId[] = notification?.to ?? [];
        for (const recipientId of recipients) {
            try {
                await notificationServices.sendNotification(toObjectId(recipientId as any), notification._id);
            } catch (err) {
                // ? One bad recipient must not stop the others from being notified.
                logger.error(`Failed to link notification ${notification._id} to user ${recipientId} : ${err}`);
            }
        }

        if (!recipients.length) return;

        // * username of the sender (the inviter) for the toast copy; a broken
        // * sender lookup must not stop the toast from reaching recipients.
        let senderName = "Someone";
        try {
            const sender = await getUser(toObjectId(notification.from as any));
            senderName = sender.username;
        } catch (err) {
            logger.error(`Could not resolve the inviter for notification ${notification._id} : ${err}`);
        }

        await emitEvent("invitation.notification.created", {
            notification,
            username: senderName,
        });
    },
    "group.timer.invitation.updated": async ({ groupTimerId, userId, status }: {
    groupTimerId: string, userId: string, status: "accepted" | "declined"
}) => {
    logger.info(`Updating invitation response for groupTimer ${groupTimerId} -> ${status}`);
    await notificationServices.updateInvitationResponseByGroupTimer(
        toObjectId(groupTimerId),
        toObjectId(userId),
        status
    );
},
}