import { Router } from "express";
import {
    createProductivityTimer,
    getActiveUsersProductivityTimers,
    getExpiredProductivityTimers,
    getCompletedProductivityTimers,
    submitProductivityTime,
} from "../controllers/timer-controller";

const productivityTimerRouter = Router();

productivityTimerRouter.get("/active-productivity-timers", getActiveUsersProductivityTimers);
productivityTimerRouter.get("/expired-productivity-timers", getExpiredProductivityTimers);
productivityTimerRouter.get("/completed-productivity-timers", getCompletedProductivityTimers);
productivityTimerRouter.post("/create-timer", createProductivityTimer);
productivityTimerRouter.post("/submit-productivity", submitProductivityTime);

export default productivityTimerRouter;