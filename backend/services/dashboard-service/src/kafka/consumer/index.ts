import { kafka } from "..";
import { logger } from "../../shared";
import { handlers } from "./handlers";

const consumer = kafka.consumer({ groupId: "dashboard-service" });

export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ dashboard-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed --> [ dashboard-service ] : ", { error });
        process.exit(1);
    }
};

const TOPICS = [
    "task.created",
    "task.completed",
    "productivityTimer.created",
    "getProductivityTime.durationUpdated",
    "group.timer.created",
    "group.timer.participant.updated",
];

export const handleConsumer = async () => {
    try {
        for (const topic of TOPICS) {
            await consumer.subscribe({ topic, fromBeginning: false });
        }
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (!message.value) return;
                const handler = handlers[topic];
                if (!handler) return;
                try {
                    const parsed = JSON.parse(message.value.toString());
                    await handler(parsed);
                } catch (error) {
                    logger.error(`❌ Failed handling ${topic} event : `, { error });
                }
            },
        });
    } catch (error) {
        logger.error("❌ Consumer run failed : ", { error });
    }
};