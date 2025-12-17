import { kafka } from "..";
import { logger } from "../../shared";

const consumer = kafka.consumer({
    groupId:"analytics-servie"
});

export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ analytic-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : --> [ analytic-service ] " , {error});
        process.exit(1); 
    }
}

export const handleConsumer = async (topics:string[]) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({topic:topic , fromBeginning:true});
        }
        await consumer.run({
            eachMessage:async ({topic , message}) => {
                console.log(`Message received from topic ${topic}: ${message.value}`);
                const key = message.key?.toString();
                const value = message.value?.toString();
                logger.info("This is the KEY : ", key , "and this is value : " , value , "of topic : " , topic);
            }
        })
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : " , {error});
    }
}


const authEvents:string[] = ["user.register" , "user.login" , "user.google-auth" , "user.logout"];
const taskEvents:string[] = ["task.created" , "task.completed" , "task.updated" , "task.deleted"];
const timerEvents:string[] = ["timer.created" , "timer.started" , "timer.paused" , "timer.resumed" , "timer.submitted" , "timer.updated" , "timer.deleted"];

export const events:string[] = [...authEvents , ...taskEvents , ...timerEvents];
// ? I have to add a disconnect function here 


