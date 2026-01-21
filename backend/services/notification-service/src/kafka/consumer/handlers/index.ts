import mongoose, { Mongoose } from "mongoose"
import { TgroupProductivityTimerForConsumer } from ".."
import pLimit from "p-limit";
import axios from "axios"
import { ApiError, logger } from "../../../shared";
import { StatusCodes } from "http-status-codes";

type TEventGroupTimerCreated = {
    userId: string,
    invitedUsersId: string[],
    groupProductivityTimer: TgroupProductivityTimerForConsumer
}

type TEventNotificationCreated = {
    notificationReceivingUsersId: mongoose.Types.ObjectId[],
    notificationId: mongoose.Types.ObjectId
}

export const handlers = {
    // ? This event is for initiating 
    "group.timer.created": async ({ userId, invitedUsersId, groupProductivityTimer
    }: TEventGroupTimerCreated) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/notification/create-notification",
                {
                    to:invitedUsersId ,
                    from: userId,
                    topic: `Invitation for Group-productivity-timer  :${groupProductivityTimer.title}`,
                    message: `You have been invited to a group-productivity-timer by ${groupProductivityTimer.author.username}`,
                    notificationType: "group-timer-request"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}`,
                    }
                }
            );

            logger.info("Notification sent", response.data);
        } catch (err) {
            logger.error("Notification API failed", err);
        }
    },

    // ? This event is for triggering the send-notification API

    "notification.created": async ({ notificationReceivingUsersId, notificationId }: TEventNotificationCreated) => {
        const limit = pLimit(5);
        for (const notificationReceivingUserId of notificationReceivingUsersId) {
            await limit(async () => {
                try {
                    const response = await axios.post("http://localhost:3000/api/v1/notification/send-notification", {
                        notificationReceivingUserId,
                        notificationId
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            // * You have to do something with this auth logic for sending requests to verified routes !
                            Authorization: `Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}`
                        }
                    })
                    console.log(`Event : notification.created , response : ${response.data}`);
                } catch (error) {
                    logger.error(error);
                    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error while sending the notification to userIds : ${notificationReceivingUsersId}`);
                }
            })

        }
    }
}