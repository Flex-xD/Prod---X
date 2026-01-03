import { Request  , Response , NextFunction } from "express";
import { asyncHandler, sendResponse } from "../shared";
import mongoose from "mongoose";
import { notificationServices } from "../service";
import { StatusCodes } from "http-status-codes";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

export const sendNotification = asyncHandler(async (req:IAuthRequest , res:Response) => {
    const {topic , message , to , notificationType} = req.body;
    const notification = await notificationServices.createNotification({topic , message , to , notificationType});

    const {userId} = req;
    // await emitEvent()
    return sendResponse( res , {
        statusCode:StatusCodes.CREATED , 
        success:true , 
        message:"Notification created Successfully !" , 
        data:notification}
    )
})