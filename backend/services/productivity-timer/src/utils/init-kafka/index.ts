import { connectConsumer, handleConsumer } from "../../kafka/consumer";
import { connectProducer } from "../../kafka/producer"

const initKafka = async () => {
    // ? let's go with the producer only because I don't think so this service is going to be consuming any events
    await connectProducer();
    // await connectConsumer();
    // await handleConsumer([]);
}

export default initKafka;

// let handleEvents;