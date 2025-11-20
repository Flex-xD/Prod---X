import z from "zod";

const TaskSchema = z.object({
    author:z.object({
        // ? See what do you actually need from the user model
    }),
    title:z.string().min(4 , "Title must be at least 4 characters long !") ,
    description:z.string().optional() , 
    status:z.enum(["pending" , "in-progress" , "completed"]).default("pending") , 
    updatedAt:z.date() ,
    createdAt:z.date() , 
    _id:z.string() 
})

export type taskSchemaType = z.infer<typeof TaskSchema>;