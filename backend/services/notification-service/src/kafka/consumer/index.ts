import axios from "axios";
import { kafka } from "..";
import { ApiError, logger } from "../../shared";
import pLimit from "p-limit";
import { StatusCodes } from "http-status-codes";
import { any, map } from "zod";
import { error } from "winston";

const consumer = kafka.consumer({
    groupId: "notification-servie"
});


export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ notification-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : ", { error });
        process.exit(1);
    }

}


// ! I will call the api for sendingNotification as soon as it the notification service's consumer listens to the desired topic from other service's producers

type TInvitationTopicAndMessage = {
    topic: string,
    message: {
        key: string,
        value: {
            userId: string,
            invitedUsersId: string[],
            groupProductivityTimer: Object,
        }
    }
}


// * TYPE FOR THE GroupProductivityTimer via value
type TgroupProductivityTimerForConsumer = {
    title: string,
    body: string,
    deadline: Date,
    invitedUsersId: string[],
    participants: string[],
    specifiedTime: number,
    author: { userId: string, username: string }
}


// ! Update this consumer code that when the event group.timer.created event is emitted ? /api/v1/create-notification will be called and which will further emit notification.created , then on listening to this event will call /api/v1/send-notification .

export const handleConsumer = async (topics: string[]) => {
    const limit = pLimit(5);
    try {
        for (const topic of topics) {
            await consumer.subscribe({ topic: topic, fromBeginning: true });
        }
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                logger.info(`This is the topic : ${topic} and value is ${message.value}`);

                switch (topic) {
                    case "group.timer.created":
                        const value: { userId: string, invitedUsersId: string[], groupProductivityTimer: TgroupProductivityTimerForConsumer } | null = JSON.parse(message.value?.toString() || "");
                        console.log(value);

                        if (!value) throw ApiError(StatusCodes.BAD_REQUEST, `No message.value found : ${message.value}`);

                        await limit(async () => {
                            for (const invitedUserId of value.invitedUsersId) {
                                try {
                                    const response = await axios.post(
                                        "http://localhost:3000/api/v1/notification/create-notification",
                                        {
                                            to: invitedUserId,
                                            from: value.userId,
                                            topic: `Invitation for Group-productivity-timer  :${value.groupProductivityTimer.title}`,
                                            message: `You have been invited to a group-productivity-timer by ${value.groupProductivityTimer.author.username}`,
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
                            }
                        })  
                        break;
                        // ? I think I may have to use if-else statements here
                    case "notification.created" :
                 
                    default:
                        break;
                }
            }
        })
    } catch (error: any) {
        logger.error("Axios failed", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
    }
}


//  I have to add a disconnect function here


// (async() => {
//     await connectConsumer();
//     await handleConsumer(["group.timer.created"]);
// })()

