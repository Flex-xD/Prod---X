import { Router } from "express";
import {
    createGroupProductivityTimer,
    getActiveGroupProductivityTimer,
    respondToGroupTimerInvitation,
    submitProductivityForGroupTimer,
    archiveGroupTimer,
    getExpiredGroupProductivityTimer,
    getCompletedGroupProductivityTimer,
    getPendingGroupTimerInvites,
} from "../controllers";

const groupTimerRouter = Router();

groupTimerRouter.get("/active-group-timers", getActiveGroupProductivityTimer);
groupTimerRouter.get("/expired-group-timers", getExpiredGroupProductivityTimer);
groupTimerRouter.get("/completed-group-timers", getCompletedGroupProductivityTimer);
groupTimerRouter.get("/pending-invites", getPendingGroupTimerInvites);
groupTimerRouter.post("/create-group-timer", createGroupProductivityTimer);
groupTimerRouter.post("/respond-invitation", respondToGroupTimerInvitation);
groupTimerRouter.post("/submit-productivity", submitProductivityForGroupTimer);
groupTimerRouter.post("/archive", archiveGroupTimer);

export default groupTimerRouter;