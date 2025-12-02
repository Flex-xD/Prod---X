import express from "express";
import { createTaskSchema } from "../schema/task-schema";
import { createTask } from "../controllers/task-controller";
import { validate } from "../shared";



const taskRoutes = express.Router();

taskRoutes.post("/create-task" , validate(createTaskSchema) , createTask);

export default taskRoutes;