import mongoose, { Types } from "mongoose";
import { string, z } from "zod";

const zObjectId = z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId",
    });

const createNotificationSchema = z.object({
    notificationType: z.enum(["group-timer-request", "daily-quote", "productivity-hack"]),
    topic: z.string(),
    message: z.string(),
    from: zObjectId,
    to: zObjectId.array()
})


// ? I am using this one here because there is not z.ObjectId availabe in zod due to which I am getting the type mismatch error 
export type TypeCreateNotification = {
    notificationType: "group-timer-request" | "daily-quote" | "productivity-hack",
    topic: string,
    message: string,
    from: mongoose.Types.ObjectId,
    to: mongoose.Types.ObjectId[]
}

const createNotificationSchemaForBody = z.object({
    notificationType: z.enum(["group-timer-request", "daily-quote", "productivity-hack"]),
    topic: z.string(),
    message: z.string(),
    to: z.string().array()
})


type TCreateNotificationInput = z.infer<typeof createNotificationSchema>;

type TCreateNotificationSchemaForBody = z.infer<typeof createNotificationSchemaForBody>;

export {
    TCreateNotificationInput,
    TCreateNotificationSchemaForBody
}