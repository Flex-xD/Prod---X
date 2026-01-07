import { Producer } from "kafkajs";
import { kafka } from "..";
import { logger } from "../../shared";


let producer: Producer | null = null;
let isConnected: boolean = false;

export const connectProducer = async (retries = 5) => {

    while (retries > 0) {
        try {
            if (isConnected) return;

            producer = kafka.producer();

            await producer.connect();
            isConnected = true;
            logger.info("✅ Kafka Producer is connected ! --> [ group-productivity-service ]");
            return;
        } catch (err) {
            retries--;
            logger.error("❌ kafka connection producer failed --> [ group-productivity-service ] ,", retries, "left");
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        console.error("❌ Kafka connection failed after all retries. Exiting.");
        process.exit(1);
    }
}


export const emitEvent =
    // ? Here classify what the event type should be , later on
    async <T extends object>(topic: string, event: T) => {
        try {
            if (!producer || !isConnected) {
                console.warn("⚠️ Failed to emit event , producer not connected , attempting to reconnect... !");
                await connectProducer();
            }
            await producer?.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify(event)
                    }
                ]
            })
            console.log(`Event emitted successfully : ${topic} & event: ${{event}} --> [ group-productivity-service-service ]`);
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

