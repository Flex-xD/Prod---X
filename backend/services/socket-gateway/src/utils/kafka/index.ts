import { Server } from "socket.io";
import { connectConsumer, handleConsumer } from "../../kafka/consumer"
import { connectProducer } from "../../kafka/producer";

const events = ["invitation.notification.created"]

export const initKafka = async(io:Server) => {
    await connectProducer();
    await connectConsumer();
    await handleConsumer([...events] , io);
}