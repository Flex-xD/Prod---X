import { z } from "zod";
import { todoSchema } from "./todo-schema";

export const userSchema = z.object({
    username:z.string().min(4 , "Username must be at least 4 characters") ,
    email:z.email() , 
    password:z.string().min(8 , "Password must be at least 8 characters") , 
    userTodos:todoSchema.array() , 
    provider:z.string().default("local").optional() , 
    avatar:z.string().optional() , 
    _id:z.string().optional()
    // I have to think of adding _id here which will be provided by mongoose
})


export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.email("Invalid email format"),
        password: z.string().min(8, "Password must be 8+ chars"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string(),
    }),
});

export type userType = z.infer<typeof userSchema>;
export type registerType = z.infer<typeof registerSchema>["body"];
export type loginType = z.infer<typeof loginSchema>["body"];
