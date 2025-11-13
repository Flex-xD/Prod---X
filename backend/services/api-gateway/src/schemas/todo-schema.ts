import { z } from "zod";

export const todoSchema = z.object({
    title: z.string(),
    description: z.string(),
    status: z.boolean().default(false),
    date: z.date().default(new Date())
})

export type todoType = z.infer<typeof todoSchema>;