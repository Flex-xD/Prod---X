import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError, asyncHandler, getUser, logger, sendResponse } from "../shared";
import { StatusCodes } from "http-status-codes";
import { createProductivityTimerInputForBody } from "../schemas/timer-schema";
import { productivityTimerServices } from "../services/timer-service";

export interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId;
}


export const createProductivityTimer = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const productivityTimer = await productivityTimerServices.createProductivityTimer(userId , {...req.body} as createProductivityTimerInputForBody);
    logger.info(`Sending Response to client ✅ with userid: ${userId}`);
    return sendResponse(res , {
        statusCode:StatusCodes.CREATED , 
        success:true , 
        message:"Productivity Timer created successfully !" , 
        data:productivityTimer
    })
});