import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId:"point-distribution-service" , 
    brokers:["localhost:9000"] , 
    logLevel:logLevel.ERROR
});

export default kafka;