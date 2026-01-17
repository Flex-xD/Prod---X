import { Request, Response, NextFunction } from "express";
import { ApiError, asyncHandler, getUser, sendResponse, toObjectId } from "../shared";
import mongoose from "mongoose";
import { notificationServices } from "../service";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";
import { TCreateNotificationSchemaForBody, TypeCreateNotification } from "../schema";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

// ? I can also use session in it but let's focus on the MVP first

export const createNotification = asyncHandler(async (req: IAuthRequest, res: Response) => {
    // console.info("This is the req.headers of notification-service : " , req.headers);
    const userId = req.headers["x-user-id"] as string;
    // const { userId } = req;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthroized !");
    }
    const user = await getUser(toObjectId(userId));

    // * req.body will be parsed before hitting the api by the validate middleware (so no need to parse it)

    const { topic, message, to, notificationType } = req.body;
    const notification = await notificationServices.createNotification({ topic, message, to, notificationType, from: toObjectId(userId) });


    // ? Emitting the notification.created event
    await emitEvent("notification.created", {
        notification,
        from: user._id,
        to
    });

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Notification created Successfully !",
        data: notification
    }
    )
})


export const sendNotification = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthroized !");
    }
    const user = await getUser(toObjectId(userId));
    const {invitedUsersId} = req.body;
    
    // * req.body will be parsed before hitting the api by the validate middleware (so no need to parse it)


    // ? Emitting the notification.created event
    await emitEvent("notification.send", {
        from:userId
    });

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Notification created Successfully !",
        // ? update the data below
        data: ""
    }
    )
})

