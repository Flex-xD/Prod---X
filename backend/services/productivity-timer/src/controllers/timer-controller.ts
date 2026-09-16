import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import { ApiError, asyncHandler, emitEvent, logger, sendResponse, toObjectId } from "../shared";
import { StatusCodes } from "http-status-codes";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { productivityTimerServices } from "../services/timer-service";

export const createProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, description, deadline, specifiedTime } = req.body.data;
    console.log(req.body);
    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specified time and deadline are required !");
    }

    const productivityTimer = await productivityTimerServices.createProductivityTimer(toObjectId(userId), { title, description, deadline, specifiedTime } as TcreateProductivityTimerInputForBody);
    logger.info(`Sending Response to client ✅ with userid: ${userId}`);

    await emitEvent("productivityTimer.created", {
        userId: userId,
        productivityTimerId: productivityTimer._id,
        productivityTimer
    })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Productivity Timer created successfully !",
        data: productivityTimer
    })

});

export type TgetProductivityTimeRequestBody = {
    productivityDuration: number,
    productivityTimerId:mongoose.Types.ObjectId
}

export const submitProductivityTime = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const { productivityDuration, productivityTimerId } = req.body;
    
    if (!productivityTimerId) {
        throw ApiError(StatusCodes.BAD_GATEWAY, "No productivity-timer id found !");
    };
    const objectTimerId = toObjectId(productivityTimerId);

    if (!productivityDuration || productivityDuration == 0) {
        let message = "No productivity duration found !";
        if (productivityDuration == 0) {
            message = "No producitivty done !"
        }

        throw ApiError(StatusCodes.BAD_GATEWAY, message);
    }

    const updatedProductivityTimer = await productivityTimerServices.submitProductivityTime(toObjectId(userId), {
        productivityDuration,
        productivityTimerId: objectTimerId, 
    });

    let message = "Productivity Timer's time period updated successfully !";

    if (updatedProductivityTimer.status = 'done') {
        message = `Congratulation , Your productivity timer named ${updatedProductivityTimer.title} is completed now !`
    }

    await emitEvent("getProductivityTime.durationUpdated", {
        userId,
        productivityTimerId,
        updatedProductivityTimer
    })

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: message,
        data: updatedProductivityTimer
    })
})

export const getActiveUsersProductivityTimers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Access !");
    }

    const activeProductivityTimers = await productivityTimerServices.getActiveUsersProductivityTimer(toObjectId(userId));

    if (activeProductivityTimers.length === 0) {
        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User has not created any Productivity Timer yet !",
            data: []
        })
    }

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Active Productivity Timers fetched successfully",
        data: activeProductivityTimers
    })
})

export const getExpiredProductivityTimers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Access !");

    const timers = await productivityTimerServices.getExpiredUsersProductivityTimer(toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Expired productivity timers fetched",
        data: timers,
    });
});