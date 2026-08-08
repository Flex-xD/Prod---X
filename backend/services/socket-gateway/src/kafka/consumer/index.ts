import kafka from "..";
import { ApiError, logger } from "../../shared";
import { handlers } from "./handlers";

const consumer = kafka.consumer({
    groupId: "socket-gateway"
});

export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ socket-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : ", { error });
        process.exit(1);
    }
};

// * TYPE FOR THE GroupProductivityTimer via value
export type TgroupProductivityTimerForConsumer = {
    title: string,
    body: string,
    deadline: Date,
    invitedUsersId: string[],
    participants: string[],
    specifiedTime: number,
    author:string
}

export const handleConsumer = async (topics: string[]) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({ topic: topic, fromBeginning: true });
        }
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (!topic || !message) {
                    return;
                }
                const handler = handlers[topic as keyof typeof handlers];
                logger.info(`This is the topic : ${topic}`);
                logger.info(`This is the message : ${message}`);
                // if (!handler) {
                //     // ? should I return a response or throw a Error here 
                //     throw ApiError(StatusCodes.CONFLICT , "Topic didn't match handlers
                //  of notification-service consumer !");
                // }
                // ? Don't forget to remove "!" from below , it's an unsafe practice
                const parsedValue = JSON.parse(message.value!.toString());
                // await handler(parsedValue);
            
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



// (async() => {
//     await connectConsumer();
//     await handleConsumer(["group.timer.created"]);
// })()

