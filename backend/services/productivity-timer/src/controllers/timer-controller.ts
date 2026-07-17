import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import { ApiError, asyncHandler, emitEvent, logger, sendResponse, toObjectId } from "../shared";
import { StatusCodes } from "http-status-codes";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { productivityTimerServices } from "../services/timer-service";


export const createProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, body, deadline, specifiedTime } = req.body;
    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specified time and deadline are required !");
    }

    const productivityTimer = await productivityTimerServices.createProductivityTimer(toObjectId(userId), { title, body, deadline, specifiedTime } as TcreateProductivityTimerInputForBody);
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
    productivityTimerId: mongoose.Types.ObjectId
}

export const submitProductivityTime = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const { productivityDuration, productivityTimerId }: TgetProductivityTimeRequestBody = req.body;
    
    if (!productivityTimerId) {
        throw ApiError(StatusCodes.BAD_GATEWAY, "No productivity-timer id found !");
    };

    if (!productivityDuration || productivityDuration == 0) {
        let message = "No productivity duration found !";
        if (productivityDuration == 0) {
            message = "No producitivty done !"
        }

        throw ApiError(StatusCodes.BAD_GATEWAY, message);
    }

    const updatedProductivityTimer = await productivityTimerServices.submitProductivityTime(toObjectId(userId), {
        productivityDuration, productivityTimerId
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