import { kafka } from "..";
import { logger } from "../../shared";

const consumer = kafka.consumer({
    groupId:"task-servie"
});


const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected !");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : " , {error});
    }
    process.exit(1);
}

const handleConsumer = async (topics:string[]) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({topic:topic , fromBeginning:true});
        }
        await consumer.run({
            eachMessage:async ({topic , message}) => {
                const key = message.key?.toString();
                const value = message.value?.toString();
                logger.info("This is the KEY : ", key , "and this is value : " , value , "of topic : " , topic);
            }
        })
    } catch (error) {
        
    }
}

// ? I have to add a disconnect function here 

(async() => {
    await connectConsumer();
    await handleConsumer(["task.created"]);
})()

