import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError, asyncHandler, emitEvent, logger, sendResponse, toObjectId } from "../shared";
import { StatusCodes } from "http-status-codes";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { productivityTimerServices } from "../services/timer-service";

export const createProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, description, deadline, specifiedTime } = req.body.data;
    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specified time and deadline are required !");
    }

    const productivityTimer = await productivityTimerServices.createProductivityTimer(
        toObjectId(userId), { title, description, deadline, specifiedTime } as TcreateProductivityTimerInputForBody
    );
    logger.info(`Sending Response to client ✅ with userid: ${userId}`);

    await emitEvent("productivityTimer.created", { userId, productivityTimerId: productivityTimer._id, productivityTimer });

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED, success: true,
        message: "Productivity Timer created successfully !", data: productivityTimer,
    });
});

export type TgetProductivityTimeRequestBody = { productivityDuration: number; productivityTimerId: mongoose.Types.ObjectId };

export const submitProductivityTime = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { productivityDuration, productivityTimerId } = req.body as { productivityDuration: number; productivityTimerId: string };

    if (!productivityTimerId) throw ApiError(StatusCodes.BAD_REQUEST, "No productivity-timer id found !");
    if (!productivityDuration || productivityDuration <= 0) {
        throw ApiError(StatusCodes.BAD_REQUEST, "productivityDuration must be a positive number of seconds !");
    }

    const updatedProductivityTimer = await productivityTimerServices.submitProductivityTime(toObjectId(userId), {
        productivityDuration, productivityTimerId: toObjectId(productivityTimerId),
    });

    const message = updatedProductivityTimer.status === "done"
        ? `Congratulations! "${updatedProductivityTimer.title}" is complete 🎉`
        : "Productivity time submitted !";

    await emitEvent("getProductivityTime.durationUpdated", { userId, productivityTimerId, updatedProductivityTimer  , productivityDuration});

    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message, data: updatedProductivityTimer });
});

export const getActiveUsersProductivityTimers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Access !");
    const activeProductivityTimers = await productivityTimerServices.getActiveUsersProductivityTimer(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Active Productivity Timers fetched successfully", data: activeProductivityTimers });
});

export const getExpiredProductivityTimers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Access !");
    const timers = await productivityTimerServices.getExpiredUsersProductivityTimer(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Expired productivity timers fetched", data: timers });
});

export const getCompletedProductivityTimers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Access !");
    const timers = await productivityTimerServices.getCompletedUsersProductivityTimer(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Completed productivity timers fetched", data: timers });
});