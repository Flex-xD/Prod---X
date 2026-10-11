import { Request, Response } from "express";
import { ApiError, asyncHandler, sendResponse, toObjectId } from "../shared";
import { StatusCodes } from "http-status-codes";
import { focusLockService } from "../services/focus-lock-service";
import { dashboardService } from "../services/dashboard-service";

const getUserIdOrThrow = (req: Request): string => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    return userId;
};

export const acquireLock = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const { sessionType, refId } = req.body;
    const lock = await focusLockService.acquire(toObjectId(userId), sessionType, refId);
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Lock acquired !", data: lock });
});

export const pauseLock = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const { refId, elapsedSinceStart } = req.body;
    const lock = await focusLockService.pause(toObjectId(userId), refId, elapsedSinceStart);
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Paused !", data: lock });
});

export const releaseLock = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const { refId } = req.body;
    await focusLockService.release(toObjectId(userId), refId);
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Released !", data: null });
});

export const getLock = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const lock = await focusLockService.get(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Fetched !", data: lock });
});

export const submitPomodoroFocus = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const { seconds } = req.body;
    if (!seconds || seconds <= 0) throw ApiError(StatusCodes.BAD_REQUEST, "seconds must be positive");

    await dashboardService.recordIndividualFocusTime(toObjectId(userId), seconds);
    await focusLockService.release(toObjectId(userId), "pomodoro");

    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Pomodoro session logged !", data: null });
});