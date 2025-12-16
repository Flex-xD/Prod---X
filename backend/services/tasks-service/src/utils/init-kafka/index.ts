import { connectConsumer, handleConsumer } from "../../kafka/consumer";
import { connectProducer } from "../../kafka/producer";

const initKafka = async () => {
    await connectProducer();
    await connectConsumer();
    await handleConsumer(["task.created"]);
}

export default initKafka;