import { Kafka ,logLevel } from "kafkajs";

export const kafka = new Kafka({
    clientId:"task-service" , 
    brokers:["localhost:9092"] , 
    logLevel:logLevel.ERROR
})

