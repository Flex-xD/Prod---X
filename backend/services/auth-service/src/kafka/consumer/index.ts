import { kafka } from "..";
import { logger } from "../../shared/utils/winston-logger";
import { handlers } from "./handlers";
import { ApiError } from "../../shared/utils/api-error";
import { StatusCodes } from "http-status-codes";

const consumer = kafka.consumer({
    groupId: "auth-service"
});

export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ auth-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed --> [ auth-service ] : ", { error });
        process.exit(1);
    }
}

export const handleConsumer = async (topics: string[]) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({ topic: topic, fromBeginning: true });
        }
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (!message.value) {
                    logger.error("There is not data with topic : " , topic);
                }
                console.log(`Message received from topic ${topic}: ${message.value}`);
                const handler = handlers[topic as keyof typeof handlers];
                const value = message.value?.toString();
                logger.info(`This is the topic : ${topic}`);
                logger.info(`This is the message : ${message}`);
                if (!handler) {
                    logger.error("Handler not found for : " , topic);
                    return;
                }
                // ? Don't forget to remove "!" from below , it's an unsafe practice
                const parsedValue = JSON.parse(message.value!.toString());
                await handler(parsedValue); console.log("VALUE : ", value);
            }
        })
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : ", { error });
    }
}


const authEvents: string[] = ["user.status.online" , "user.status.offline"];

export const events: string[] = [...authEvents];
// ? I have to add a disconnect function here 



