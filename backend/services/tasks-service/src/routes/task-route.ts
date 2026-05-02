import express from "express";
import { createTaskSchema } from "../schema/task-schema";
import { createTask, getTodaysTask, markTaskDone  , markTaskPending} from "../controllers/task-controller";
import { validate } from "../shared";

const taskRoutes = express.Router();

taskRoutes.post("/create-task"  , createTask);
taskRoutes.get("/todays-tasks" , getTodaysTask);
taskRoutes.post("/done" , markTaskDone);
taskRoutes.post("/pending" , markTaskPending);

export default taskRoutes;