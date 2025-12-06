import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import { ApiError, asyncHandler, emitEvent, getUser, logger, sendResponse } from "../shared";
import { StatusCodes } from "http-status-codes";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { productivityTimerServices } from "../services/timer-service";

export interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId;
}


export const createProductivityTimer = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, body, deadline, specifiedTime } = req.body;
    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
    }

    const productivityTimer = await productivityTimerServices.createProductivityTimer(userId, { title, body, deadline, specifiedTime } as TcreateProductivityTimerInputForBody);
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

export const getProductivityTime = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const { productivityDuration, productivityTimerId }: TgetProductivityTimeRequestBody = req.body;

    if (!productivityTimerId) {
        throw ApiError(StatusCodes.BAD_GATEWAY , "No productivity timer id found !");
    } else if (!productivityDuration) {
        throw ApiError(StatusCodes.BAD_GATEWAY, "No prodcutvity duration found !")
    }

    const updatedProductivityTimer = await productivityTimerServices.getProductivityTime(userId , {
        productivityDuration , productivityTimerId
    });

    await emitEvent("getProductivityTime.durationUpdated" , {
        userId , 
        productivityTimerId , 
        updatedProductivityTimer
    })

    return sendResponse(res , {
        statusCode:StatusCodes.OK , 
        success:true , 
        message:"Productivity Timer's time period updated successfully !" , 
        data:updatedProductivityTimer
    })
})