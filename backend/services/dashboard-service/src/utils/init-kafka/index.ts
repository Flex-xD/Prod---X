import { connectConsumer, handleConsumer } from "../../kafka/consumer";

export const initKafka = async () => {
    await connectConsumer();
    await handleConsumer();
};