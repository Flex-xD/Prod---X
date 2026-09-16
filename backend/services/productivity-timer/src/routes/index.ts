import { Router } from "express";
import { createProductivityTimer, getActiveUsersProductivityTimers, getExpiredProductivityTimers, submitProductivityTime } from "../controllers/timer-controller";

const productivityTimerRouter = Router();

productivityTimerRouter.get("/active-productivity-timers" , getActiveUsersProductivityTimers);
productivityTimerRouter.post("/create-timer" , createProductivityTimer);
productivityTimerRouter.get("/expired-productivity-timers", getExpiredProductivityTimers);
productivityTimerRouter.post("/submit-productivity", submitProductivityTime);

export default productivityTimerRouter;