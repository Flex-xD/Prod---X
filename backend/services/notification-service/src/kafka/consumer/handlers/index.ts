import mongoose, { Mongoose } from "mongoose"
import { TgroupProductivityTimerForConsumer } from ".."
import pLimit from "p-limit";
import axios from "axios"
import { ApiError, logger } from "../../../shared";
import { StatusCodes } from "http-status-codes";
import { INotification } from "../../../model/Notification";

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
                    notificationType: "group-timer-request"
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

    // ? This event is for triggering the send-notification API

    "notification.created": async ({ notification }: TEventNotificationCreated) => {
        logger.info("Sending API request to : /send-notification")
        const limit = pLimit(notification.to.length);
        for (const notificationReceivingUserId of notification.to) {
            await limit(async () => {
                try {
                    logger.info(`Sending API request to : /send-notification/${notificationReceivingUserId}`)

                    const response = await axios.post("http://localhost:3000/api/v1/notification/send-notification", {
                        notificationReceivingUserId , 
                        notificationId:notification._id , 
                        userId:notification.from
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-service-key": process.env.PRODX_SERVICE_KEY,
                        }
                    })
                    console.log(`Event : notification.created , response :`, response.data);
                } catch (error) {
                    logger.error({ error })
                    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error while sending the notification to userIds : ${notification.to}`);
                }
            })

        }
    }
}