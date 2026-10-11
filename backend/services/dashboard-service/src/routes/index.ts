import { Router } from "express";
import {
    getDashboardSummary,
    getWeeklyGraph,
    getCalendar,
    getAiTip,
    getActivityMessage,
    getAvailableYears,
} from "../controllers";
import { acquireLock, getLock, pauseLock, releaseLock, submitPomodoroFocus } from "../controllers/focus-controller";

const dashboardRouter = Router();

dashboardRouter.get("/summary", getDashboardSummary);
dashboardRouter.get("/weekly-graph", getWeeklyGraph);
dashboardRouter.get("/ai-tip", getAiTip);
dashboardRouter.get("/activity-message", getActivityMessage);
dashboardRouter.get("/calendar", getCalendar);
dashboardRouter.get("/calendar/years", getAvailableYears);

// ? Pomodormo timer
dashboardRouter.post("/focus-lock/acquire", acquireLock);
dashboardRouter.post("/focus-lock/pause", pauseLock);
dashboardRouter.post("/focus-lock/release", releaseLock);
dashboardRouter.get("/focus-lock", getLock);
dashboardRouter.post("/log-pomodoro", submitPomodoroFocus);

export default dashboardRouter;