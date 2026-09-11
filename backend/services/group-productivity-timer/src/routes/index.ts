import {Router} from "express";
import { createGroupProductivityTimer, getActiveGroupProductivityTimer, respondToGroupTimerInvitation } from "../controllers";
const groupTimerRouter = Router();

groupTimerRouter.get("/active-group-timers" , getActiveGroupProductivityTimer);
groupTimerRouter.post("/create-group-timer" , createGroupProductivityTimer);
groupTimerRouter.post("/respond-invitation", respondToGroupTimerInvitation);

export default groupTimerRouter;