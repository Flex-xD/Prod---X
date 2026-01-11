import axios from "axios";
import { kafka } from "..";
import { ApiError, logger } from "../../shared";
import pLimit from "p-limit";
import { StatusCodes } from "http-status-codes";
import { any } from "zod";

const consumer = kafka.consumer({
    groupId:"notification-servie"
});


export const connectConsumer = async () => {
    try {
        await consumer.connect();
        logger.info("✅ kafka consumer is connected ! --> [ notification-service ]");
    } catch (error) {
        logger.error("❌ kafka consumer connection failed : " , {error});
        process.exit(1);
    }
    
}


// ! I will call the api for sendingNotification as soon as it the notification service's consumer listens to the desired topic from other service's producers

type TInvitationTopicAndMessage = {
    topic:string , 
    message:{
        key:string ,
        value:{
        userId:string , 
        invitedUsersId:string[] , 
        groupProductivityTimer:Object , 
    }}
}

export const handleConsumer = async (topics:string[]) => {
    const limit = pLimit(5);
    try {
        for (const topic of topics) {
            await consumer.subscribe({topic:topic , fromBeginning:true});
        }
        await consumer.run({
            eachMessage:async ({topic , message}) => {
                const key = message.key?.toString();
                const value = message.value?.toString();

                logger.info(`This is the KEY : ${key} , this is the value : ${value} from the topic : ${topic}`);

                switch (topic) {
                    case "group.timer.created" :

                        if (!message.value) throw ApiError(StatusCodes.BAD_REQUEST , `No message.value found : ${message.value}`);
                        
                        await limit(async () => {
                        message.value.invitedUsersId.forEach(async (userId) => {
                                await axios.post("http://localhost:10000/api/v1/notification/create-notification"  , {
                                    to:userId , 
                                    topic:"Invitation : Group-productivity-timer" ,
                                    message:"You have been invited to a group-productivity-timer" ,   
                                    notificationType:      "group-timer-request"                           
                                })
                            });                            
                        })
                    default :
                        break;
                }
            }
        })
    } catch (error) {
        logger.error(`Error in the kafka consumer of the Notificatino-service !`);
    }
}


//  I have to add a disconnect function here 


// (async() => {
//     await connectConsumer();
//     await handleConsumer(["group.timer.created"]);
// })()

