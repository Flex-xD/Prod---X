import { kafka } from "..";
import { logger } from "../../shared";

const consumer = kafka.consumer({
    groupId:"notification-servie"
});


export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ notification-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : " , {error});
        process.exit(1);
    }
    
}


// ! I will call the api for sendingNotification as soon as it the notification service's consumer listens to the desired topic from other service's producers

export const handleConsumer = async (topics:string[]) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({topic:topic , fromBeginning:true});
        }
        await consumer.run({
            eachMessage:async ({topic , message}) => {
                const key = message.key?.toString();
                const value = message.value?.toString();
                logger.info(`This is the KEY : ${key} , this is the value : ${value} from the topic : ${topic}`);
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

