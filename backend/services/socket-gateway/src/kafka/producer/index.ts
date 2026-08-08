import { Producer } from "kafkajs";
import kafka from "..";
import { ApiError, logger } from "../../shared";
import { JSONSchema } from "zod/v4/core";

let producer: Producer | null = null;
let isConnected: boolean = false;

export const connectProducer = async (retries = 5) => {
    while (retries >= 5) {
        try {
            if (isConnected) return;
            producer = kafka.producer();
            await producer.connect();
            isConnected = true;
            logger.info("Kafka Producer connected successfully ! --> [ socket-service ]")
            return;
        } catch (error: any) {
            retries--;
            logger.error(`Kafka Producer connection failed -- [ Socket-gateway ] , retries left ${retries}`);
            new Promise((resolve) => (setTimeout(resolve, 2000)));
        }
        console.error("❌ Kafka connection failed after all retries. Exiting.");
        process.exit(1);
    }
};

export const emitEvent = async <T extends Object>(topic: string, value: T) => {
    try {
        if (!producer || !isConnected) {
            console.warn("⚠️ Failed to emit event , producer not connected , attempting to reconnect... !");
            connectProducer();
        }
        await producer?.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(value)
                }
            ]
        })
    } catch (error) {
        logger.error("❌ Failed to emit event : ", { error });

    }
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
