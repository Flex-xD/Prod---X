
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

type createProductivityTimerInput = z.infer<typeof createProductivityTimerSchema>;

type createProductivityTimerInputForBody = z.infer<typeof createProductivityTimerSchemaForBody>;

export {
    createProductivityTimerInput , 
    createProductivityTimerInputForBody
}