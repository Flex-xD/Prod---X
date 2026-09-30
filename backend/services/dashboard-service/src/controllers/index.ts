import { Request, Response } from "express";
import { ApiError, asyncHandler, sendResponse, toObjectId } from "../shared";
import { StatusCodes } from "http-status-codes";
import { dashboardService } from "../services/dashboard-service";

const getUserIdOrThrow = (req: Request): string => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    return userId;
};

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const data = await dashboardService.getSummary(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Dashboard summary fetched !", data });
});

export const getWeeklyGraph = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const data = await dashboardService.getWeeklyGraph(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Weekly graph fetched !", data });
});

export const getCalendar = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const weeks = req.query.weeks ? Number(req.query.weeks) : 53;
    const data = await dashboardService.getCalendar(toObjectId(userId), weeks);
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Calendar fetched !", data });
});

export const getAiTip = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const tip = await dashboardService.getAiTip(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Tip fetched !", data: { tip } });
});

export const getActivityMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const message = await dashboardService.getActivityMessage(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Activity message fetched !", data: { message } });
});