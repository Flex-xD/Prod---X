import mongoose, { Mongoose } from "mongoose"
import { TgroupProductivityTimerForConsumer } from ".."
import pLimit from "p-limit";
import axios from "axios"
import { ApiError, logger } from "../../../shared";
import { StatusCodes } from "http-status-codes";

type TEventGroupTimerCreated = {
    userId: string,
    invitedUsersId: string[],
    groupProductivityTimer: TgroupProductivityTimerForConsumer ,
    token:string
}

type TEventNotificationCreated = {
    notificationReceivingUsersId: mongoose.Types.ObjectId[],
    notificationId: mongoose.Types.ObjectId , 
    token:string
}

export const handlers = {
    // ? This event is for initiating the create-notification API
    "group.timer.created": async ({ userId, invitedUsersId, groupProductivityTimer , token
    }: TEventGroupTimerCreated) => {
        try {
            logger.info("Sending API request to : /create-notification")
            const response = await axios.post(
                "http://localhost:3000/api/v1/notification/create-notification",
                {
                    to: invitedUsersId,
                    from: userId,
                    topic: `Invitation for Group-productivity-timer  :${groupProductivityTimer.title}`,
                    message: `You have been invited to a group-productivity-timer by ${groupProductivityTimer.author.username}`,
                    notificationType: "group-timer-request"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

        } catch (err: any) {
            throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR , `Error while sending the request to the /create-notification API : ${err}`)
            logger.error("Notification API failed", err.response );
        }
    },

    // ? This event is for triggering the send-notification API

    "notification.created": async ({ notificationReceivingUsersId, notificationId  , token}: TEventNotificationCreated) => {
        logger.info("Sending API request to : /send-notification")
        const limit = pLimit(5);
        for (const notificationReceivingUserId of notificationReceivingUsersId) {
            await limit(async () => {
                try {
                    logger.info(`Sending API request to : /send-notification/${notificationReceivingUserId}`)

                    const response = await axios.post("http://localhost:3000/api/v1/notification/send-notification", {
                        notificationReceivingUserId,
                        notificationId
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            // * You have to do something with this auth logic for sending requests to verified routes !
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(`Event : notification.created , response : ${response.data}`);
                } catch (error) {
                    logger.error({error})
                    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error while sending the notification to userIds : ${notificationReceivingUsersId}`);
                }
            })

        }
    }
}