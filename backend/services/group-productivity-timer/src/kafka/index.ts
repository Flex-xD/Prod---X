import { Kafka ,logLevel } from "kafkajs";

export const kafka = new Kafka({
    clientId:"group-productivity-timer" , 
    brokers:["localhost:9092"] , 
    logLevel:logLevel.ERROR
})

