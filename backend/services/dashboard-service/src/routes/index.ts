import { Router } from "express";
import {
    getDashboardSummary,
    getWeeklyGraph,
    getCalendar,
    getAiTip,
    getActivityMessage,
} from "../controllers";

const dashboardRouter = Router();

dashboardRouter.get("/summary", getDashboardSummary);
dashboardRouter.get("/weekly-graph", getWeeklyGraph);
dashboardRouter.get("/calendar", getCalendar);
dashboardRouter.get("/ai-tip", getAiTip);
dashboardRouter.get("/activity-message", getActivityMessage);

export default dashboardRouter;