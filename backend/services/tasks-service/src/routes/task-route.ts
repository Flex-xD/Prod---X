import express from "express";
import { createTaskSchema } from "../schema/task-schema";
import { createTask, getTodaysTask } from "../controllers/task-controller";
import { validate } from "../shared";

const taskRoutes = express.Router();

taskRoutes.post("/create-task"  , createTask);
taskRoutes.get("/todays-tasks" , getTodaysTask);

export default taskRoutes;