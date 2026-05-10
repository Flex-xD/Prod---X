
import {z} from "zod";

const createProductivityTimerSchema = z.object({
    title:z.string().min(4 , "Title must be at least 4 character long !") , 
    body:z.string().optional() , 
    specifiedTime:z.number(),
    deadline:z.date() , 
    completedTime:z.number() , 
    isCompleted:z.boolean().default(false) , 
    author:z.string()
})

const createProductivityTimerSchemaForBody = z.object({
    title:z.string().min(4 , "Title must be at least 4 character long !") , 
    body:z.string().optional() , 
    specifiedTime:z.number(),
    deadline:z.date() , 
})


type TcreateProductivityTimerInput = z.infer<typeof createProductivityTimerSchema>;

type TcreateProductivityTimerInputForBody = z.infer<typeof createProductivityTimerSchemaForBody>;

export {
    TcreateProductivityTimerInput , 
    TcreateProductivityTimerInputForBody
}