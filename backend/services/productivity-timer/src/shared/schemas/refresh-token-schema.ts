import z from "zod";

const refreshTokenSchema = z.object({
    hashedToken:z.string() , 
    userAgent:z.string() , 
    ip:z.string().optional().default("") , 
    createdAt:z.date().default( new Date()).optional() , 
    expiresAt:z.date() , 
    absoluteExpiresAt: z.date()

})

export type refreshTokenType = z.infer<typeof refreshTokenSchema>;
export default refreshTokenSchema;