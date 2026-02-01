import { Request, Response, NextFunction } from "express";
import { ApiError, asyncHandler, getUser, logger, sendResponse, toObjectId } from "../shared";
import mongoose from "mongoose";
import { notificationServices } from "../service";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";
import { TypeCreateNotification } from "../schema";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

// ? I can also use session in it but let's focus on the MVP first

export const createNotification = asyncHandler(async (req: IAuthRequest, res: Response) => {
    // console.info("This is the req.headers of notification-service : " , req.headers);
    console.info("Creating notification . . .")
    const { topic, message, to, notificationType , userId} = req.body;
    // const { userId } = req;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthroized !");
    }

    // const user = await getUser(toObjectId(userId));

    // * req.body will be parsed before hitting the api by the validate middleware (so no need to parse it)

    const notification = await notificationServices.createNotification({ topic, message, to, notificationType, from: toObjectId(userId) });

    // ? Emitting the notification.created event
    await emitEvent("notification.created", {
        notificationId:notification._id,
        notificationReceivingUsersId:to , 
        userId
    });
    
    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Notification created Successfully !",
        data: notification
    })

})

export const sendNotification = asyncHandler(async (req: IAuthRequest, res: Response) => {
    logger.info(`Sending notification...`)
    const {notificationReceivingUserId , notificationId, userId} = req.body;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthroized !");
    }
    
    // const user = await getUser(toObjectId(userId));

    // * req.body will be parsed before hitting the api by the validate middleware (so no need to parse it)
    logger.info(`Forwaring the data to the notification-servive...`)
    const notification:TypeCreateNotification  = await notificationServices.sendNotification(notificationReceivingUserId , notificationId);

    // ? Emitting the notification.created event
    await emitEvent("notification.send", {
        notificationId, 
        from:userId
    });

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        // ? Try to get something better to show to whom the notifications has been sent !
        message: `Notification sent to the user ${notificationReceivingUserId} : ${notification.topic}`,
        // ? update the data below
        data: `Notification ID : ${notificationId}`
    }
    )
})

