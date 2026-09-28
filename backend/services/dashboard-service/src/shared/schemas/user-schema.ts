import { z } from "zod";
import refreshTokenSchema from "./refresh-token-schema";

export const userSchema = z.object({
    username:z.string().min(4 , "Username must be at least 4 characters") ,
    email:z.email() , 
    password:z.string().min(8 , "Password must be at least 8 characters") , 
    // ? Fix the user todos type later
    userTasks:z.array(z.string()) , 
    userProductivityTimer:z.array(z.string()) ,
    provider:z.string().default("local").optional() , 
    avatar:z.string().optional() , 
    _id:z.string() ,
    refreshTokens:refreshTokenSchema.array()
})


export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
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
