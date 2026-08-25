import kafka from "..";
import { logger } from "../../shared";

const consumer = kafka.consumer({
    groupId: "point-distribution-service"
});

let isConnected: boolean = false;

const connectConsumer = async () => {
    try {
        if (isConnected) return;
        await consumer.connect()
    } catch (error: any) {
        logger.error("Error while connecting to the consumer - [ point-distribution-service ] ", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
    }
};

export const handleConsumer = async (topics:string[]) => {
    try {
        for (const topic of topics) {
            await consumer.subscribe({topic , fromBeginning:true})
        }

        await consumer.run({
            eachMessage:async ({topic , message}) => {
                
            }
        })
    } catch (error:any) {
        logger.error("Error while handling the topics - [ point-distribution-service ] ", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
    }
}