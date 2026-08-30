import { StatusCodes } from "http-status-codes";
import kafka from "..";
import { ApiError, logger } from "../../shared";
import { createHandlers } from "./handlers";
import { Server } from "socket.io";

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


export const handleConsumer = async (topics: string[] , io:Server) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({ topic: topic, fromBeginning: false });
        }
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (!topic || !message) {
                    return;
                }
                const handlers = createHandlers(io);
                const handler = handlers[topic as keyof typeof handlers];
                logger.info(`This is the topic : ${topic}`);
                logger.info(`This is the message : ${JSON.stringify(message)}`);
                if (!handler) {
                    // ? should I return a response or throw a Error here 
                    throw ApiError(StatusCodes.CONFLICT ,                     "Topic didn't match handlers of notification-service consumer !");
                }
                // ? Don't forget to remo)ve "!" from below , it's an unsafe practice
                const parsedValue = JSON.parse(message.value!.toString());
                await handler(parsedValue);
            
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

