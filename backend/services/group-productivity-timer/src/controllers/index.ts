import mongoose from "mongoose";
import { ApiError, asyncHandler, logger, sendResponse } from "../shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

export const createGroupProductivityTimer = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, body, deadline, specifiedTime } = req.body;
    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
    }

    // const productivityTimer = await productivityTimerServices.createProductivityTimer(userId, { title, body, deadline, specifiedTime } as TcreateProductivityTimerInputForBody);
    logger.info(`Sending Response to client ✅ with userid: ${userId}`);

    await emitEvent("groupProductivityTimer.created", {
        userId: userId,
        // productivityTimerId: productivityTimer._id,
        // productivityTimer
    })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Productivity Timer created successfully !",
        data: "productivityTimer"
    })

})