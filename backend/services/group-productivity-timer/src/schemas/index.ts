
import { z } from "zod";

const createProductivityTimerSchema = z.object({
    title: z.string().min(4, "Title must be at least 4 character long !"),
    body: z.string().optional(),
    specifiedTime: z.number(),
    deadline: z.date(),
    completedTime: z.number(),
    author: z.string()
})

const createGroupProductivityTimerSchemaForBody = z.object({
    title: z.string().min(4, "Title must be at least 4 character long !"),
    body: z.string().optional(),
    specifiedTime: z.number(),
    deadline: z.date(),
    invitedUsersId:z.array(z.string())
})


type TcreateProductivityTimerInput = z.infer<typeof createProductivityTimerSchema>;

type TcreateGroupProductivityTimerInputForBody = z.infer<typeof createGroupProductivityTimerSchemaForBody>;

export {
    TcreateProductivityTimerInput,
    TcreateGroupProductivityTimerInputForBody
}