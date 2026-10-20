import { Server } from "socket.io";
import { connectConsumer, handleConsumer } from "../../kafka/consumer"
import { connectProducer } from "../../kafka/producer";

// * Events forwarded from Kafka to the browser over socket.io rooms.
// * `group.timer.participant.updated` is what makes group-timer ranks update
// * live for every other participant (it was missing, so nobody ever received it).
const events = ["invitation.notification.created", "group.timer.participant.updated"]

export const initKafka = async(io:Server) => {
    await connectProducer();
    await connectConsumer();
    await handleConsumer([...events] , io);
}