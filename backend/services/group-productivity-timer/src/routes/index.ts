import {Router} from "express";
import { createGroupProductivityTimer, getActiveGroupProductivityTimer } from "../controllers";
const groupTimerRouter = Router();

groupTimerRouter.get("/active-group-timers" , getActiveGroupProductivityTimer);
groupTimerRouter.post("/create-group-timer" , createGroupProductivityTimer);

export default groupTimerRouter;