import axios from "axios";
import { kafka } from "..";
import { ApiError, logger } from "../../shared";
import pLimit from "p-limit";
import { StatusCodes } from "http-status-codes";
import { any } from "zod";
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
                        const value: { userId: string, invitedUsersId: string[] } | null = JSON.parse(message.value?.toString() || "");
                        console.log(value);

                        if (!value) throw ApiError(StatusCodes.BAD_REQUEST, `No message.value found : ${message.value}`);

                        await limit(async () => {
                            // ! Fix this later on , first test it weather it is sending the API request to different users or not smoothly
                            console.log("JWT_VALUE" , process.env.NOTIFICATION_SERVICE_TOKEN);
                            // const groupProductivityTimer = value.groupProductivityTimer;
                            value.invitedUsersId.forEach(async (invitedUserId: string) => {
                                try {
                                    await axios.post("http://localhost:3000/api/v1/notification/create-notification", {
                                        to: invitedUserId,
                                        from: value.userId,
                                        topic: "Invitation : Group-productivity-timer",
                                        message: "You have been invited to a group-productivity-timer",
                                        notificationType: "group-timer-request"
                                    } , {
                                        headers:{
                                            "Content-Type":"application/json" , 
                                            "Authorization":`Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}`
                                        }
                                    })
                                } catch (error:any) {
                                    throw ApiError(StatusCodes.BAD_REQUEST , error);
                                }
                            });
                        })
                    default:
                        break;
                }
            }
        })
    } catch (error) {
        logger.error(`Error in the kafka consumer of the Notificatino-service !`);
    }
}


//  I have to add a disconnect function here


// (async() => {
//     await connectConsumer();
//     await handleConsumer(["group.timer.created"]);
// })()

