import z from "zod";

const TaskSchema = z.object({
    author: z.object({
        _id: z.string(),
        username: z.string(),
        avatar: z.string()
    }),
    title: z.string().min(4, "Title must be at least 4 characters long !"),
    description: z.string().optional(),
    status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
    _id: z.string()
})

export const createTaskSchema = z.object({
    title: z.string().min(4, "Title must be at least 4 characters"),
    description: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type taskSchemaType = z.infer<typeof TaskSchema>;