import { Request  , Response , NextFunction } from "express";
import { ApiError, asyncHandler, getUser, sendResponse } from "../shared";
import mongoose from "mongoose";
import { notificationServices } from "../service";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

export const sendNotification = asyncHandler(async (req:IAuthRequest , res:Response) => {
    const {topic , message , to , notificationType} = req.body;
    const notification = await notificationServices.createNotification({topic , message , to , notificationType});

    const {userId} = req;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED , "You are unauthroized !");
    }
    const user = await getUser(userId);

    await emitEvent("notification.created" , {
        notification , 
        from:user._id , 
        to
    })
    return sendResponse( res , {
        statusCode:StatusCodes.CREATED , 
        success:true , 
        message:"Notification created Successfully !" , 
        data:notification}
    )
})