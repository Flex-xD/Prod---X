import {Router} from "express";
import { createGroupProductivityTimer, getActiveGroupProductivityTimer, getExpiredGroupProductivityTimer, getPendingGroupTimerInvites, respondToGroupTimerInvitation, submitProductivityForGroupTimer } from "../controllers";
const groupTimerRouter = Router();

groupTimerRouter.get("/active-group-timers" , getActiveGroupProductivityTimer);
groupTimerRouter.post("/create-group-timer" , createGroupProductivityTimer);
groupTimerRouter.post("/respond-invitation", respondToGroupTimerInvitation);
groupTimerRouter.get("/expired-group-timers", getExpiredGroupProductivityTimer);
groupTimerRouter.get("/pending-invites", getPendingGroupTimerInvites);
groupTimerRouter.post("/submit-productivity", submitProductivityForGroupTimer);

export default groupTimerRouter;