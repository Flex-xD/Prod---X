import { connectConsumer, handleConsumer } from "../../kafka/consumer";
import { connectProducer } from "../../kafka/producer";

export const initKafka = async () => {
    await connectProducer()
    await connectConsumer()
    await handleConsumer(["group.timer.created" , "notification.created"]);
}