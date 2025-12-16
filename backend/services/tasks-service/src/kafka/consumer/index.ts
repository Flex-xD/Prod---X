import { kafka } from "..";
import { logger } from "../../shared";

const consumer = kafka.consumer({
    groupId: "task-servie"
});


export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ task-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed --> [ task-service ] : ", { error });
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
                logger.info(
                    `[${topic}] ${message.key?.toString()} -> ${message.value?.toString()}`
                );
            }
        })
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : ", { error });
    }
}

// ? I have to add a disconnect function here 


