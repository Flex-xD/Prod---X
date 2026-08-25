import { Producer } from "kafkajs";
import { logger } from "../../shared";
import kafka from "..";


let isConnected = false;
let producer: Producer | undefined;

const connectProduer = async (retries = 5) => {
    try {
        while (retries >= 0) {
            if (isConnected) return;
            producer = kafka.producer();
            await producer.connect();
            isConnected = true;
            console.log("Kafka producer connected to the service - [ point-distribution-service ]");
        }
    } catch (error: any) {
        retries--;
        logger.error("Error while connecting to the producer - [ Point-distribution-service ]", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        }); 
        await new Promise((resolve) => { setTimeout(resolve, 2000) });
    }
}

const emitEvent = async <T extends object>(topic: string, event: T) => {
    try {
        if (!producer && !isConnected) {
            producer = kafka.producer();
            producer.connect();
            isConnected = true;
        }
        await producer?.send({
            topic,
            messages: [{
                value: JSON.stringify(event)
            }
            ]
        });

    } catch (error:any) {
    logger.error("Error while emitting the event - [ Point-distribution-service ]", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });     }
}

async function disconnectProducer() {
    if (producer && isConnected) {
        try {
            await producer.disconnect();
            console.log("🟡 Kafka producer disconnected gracefully");
        } catch (err) {
            console.error("Error disconnecting Kafka producer:", err);
        }
    }
}

process.on("SIGTTIN", disconnectProducer);
process.on("SIGINT", disconnectProducer);

export default connectProduer;