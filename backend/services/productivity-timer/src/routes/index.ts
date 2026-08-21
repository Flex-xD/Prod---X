import { Router } from "express";
import { createProductivityTimer, getActiveUsersProductivityTimers } from "../controllers/timer-controller";

const productivityTimerRouter = Router();

productivityTimerRouter.get("/active-productivity-timers" , getActiveUsersProductivityTimers);
productivityTimerRouter.post("/create-timer" , createProductivityTimer);
productivityTimerRouter.get("/active-users-timer" , getActiveUsersProductivityTimers);

export default productivityTimerRouter;