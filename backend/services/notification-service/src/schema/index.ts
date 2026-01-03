import {z} from "zod";

const createNotificationSchema = z.object({
    notificationType:z.enum(["group-timer-request" , "daily-quote" , "productivity-hack"]) ,
    topic:z.string() , 
    message:z.string() , 
    from:z.string().optional() , 
    to:z.string().optional()
})

const createNotificationSchemaForBody = z.object({
    notificationType:z.enum(["group-timer-request" , "daily-quote" , "productivity-hack"]),
    topic:z.string() , 
    message:z.string() , 
    to:z.string().optional()
})


type TCreateNotificationInput = z.infer<typeof createNotificationSchema>;

type TCreateNotificationSchemaForBody = z.infer<typeof createNotificationSchemaForBody>;

export {
    TCreateNotificationInput , 
    TCreateNotificationSchemaForBody
}