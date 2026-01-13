import { kafka } from "..";
import { logger } from "../../shared";

const consumer = kafka.consumer({
    groupId: "group-productivity-timer"
});

export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ group-productivity-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed --> [ group-productivity-service ] : ", { error });
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
                console.log(`Message received from topic ${topic}: ${message.value}`);
                const value = message.value?.toString();
                logger.info("This is value : ", value, "of topic : ", topic);
            }
        })
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : ", { error });
    }
}


// const authEvents: string[] = ["user.register", "user.login", "user.google-auth", "user.logout"];
// const taskEvents: string[] = ["task.created", "task.completed", "task.updated", "task.deleted"];
const timerEvents: string[] = ["group.timer.created", "group.timer.started", "group.timer.paused", "group.timer.resumed", "group.timer.submitted", "group.timer.updated", "group.timer.deleted"];

export const events: string[] = [ ...timerEvents];
// ? I have to add a disconnect function here 



