import {Kafka, logLevel} from "kafkajs";

const kafka = new Kafka({
    clientId:"socket-gateway" ,
    brokers:["localhost:9092"] , 
    logLevel:logLevel.ERROR
})

export default kafka;