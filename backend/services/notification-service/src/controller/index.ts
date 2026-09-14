import { Request, Response, NextFunction } from "express";
import { ApiError, asyncHandler, getUser, logger, sendResponse, toObjectId } from "../shared";
import mongoose, { get } from "mongoose";
import { notificationServices } from "../service";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

// ? I can also use session in it but let's focus on the MVP first

export const createNotification = asyncHandler(async (req: IAuthRequest, res: Response) => {
    // console.info("This is the req.headers of notification-service : " , req.headers);
    console.info("Creating notification . . .")
    const { topic, message, to, notificationType, from: userId , invitation} = req.body;
    // const { userId } = req;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthroized !");
    }

    // const user = await getUser(toObjectId(userId));

    // * req.body will be parsed before hitting the api by the validate middleware (so no need to parse it)

    const notification = await notificationServices.createNotification({ topic, message, to, notificationType, from: toObjectId(userId)  , invitation});

    // ? Emitting the notification.created event
    await emitEvent("notification.created", {
        notification,
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
    const { notificationReceivingUserId, notificationId, userId } = req.body;
    // if (!userId) {
    //     throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthroized !");
    // }

    // const user = await getUser(toObjectId(userId));

    // ? req.body will be parsed before hitting the api by the validate middleware (so no need to parse it)

    logger.info(`Forwaring the data to the notification-servive...`)
    const notification = await notificationServices.sendNotification(notificationReceivingUserId, notificationId);
    const user = await getUser(userId);
    // ? Emitting the notification.created event
    await emitEvent("invitation.notification.created", {
        notification,
        username: user.username
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
});

export const getNotifications = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const userId = req.params.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;

    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "You are unauthorized !");

    const data = await notificationServices.getNotificationsForUser(toObjectId(userId), page, limit);

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Notifications fetched successfully !",
        data,
    });
});

export const markNotificationAsRead = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { notificationId } = req.params;
    // * This userId is going to be from the frontend
    const userId = req.body.userId; 
    const notification = await notificationServices.markAsRead(toObjectId(notificationId), toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Notification marked as read !",
        data: notification,
    });
});

export const markAllNotificationsAsRead = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req.params;
    await notificationServices.markAllAsRead(toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All notifications marked as read !",
        data: null,
    });
});

