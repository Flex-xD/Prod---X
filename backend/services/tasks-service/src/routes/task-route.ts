import { validate } from "@shared/src/middlewares/zod-middleware";
import express from "express";
import { createTaskSchema } from "../schema/task-schema";
import { createTask } from "../controllers/task-controller";
const taskRoutes = express.Router();

// * Define routes later , first design it
taskRoutes.post("/create-task" , validate(createTaskSchema) , createTask);

export default taskRoutes;