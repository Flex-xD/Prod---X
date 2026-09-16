import RootFilterQuery from 'mongoose';
import { ApiError, asyncHandler, getUser, logger, sendResponse, toObjectId } from "../shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";
import { groupProductivityTimerServices } from "../services";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";

// ? In this controller the timer is being created for a group , now I have to also add the user inviting logic into this 

export const createGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    // ? May be I can remove the as string from below ???
    const userId = req.headers["x-user-id"] as string;

    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    console.log("This is the req.body : ", req.body);
    const { title, description, deadline, specifiedTime, invitedUsersId }: TcreateGroupProductivityTimerInputForBody = req.body.data;

    console.log("Invited User IDS : ", invitedUsersId)
    if (invitedUsersId.length == 0) {
        throw ApiError(StatusCodes.BAD_REQUEST, "You must invite at least one user !");
    }

    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
    }

    const groupProductivityTimer = await groupProductivityTimerServices.createGroupProductivityTimerService(toObjectId(userId), { title, description, deadline, specifiedTime, invitedUsersId } as TcreateGroupProductivityTimerInputForBody);


    logger.info(`Sending Response to client ✅ with userid: ${userId}`);

    await emitEvent("group.timer.created", {
        userId,
        groupProductivityTimer,
        token
    })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Group-roductivity-Timer created successfully !",
        data: groupProductivityTimer
    })

})


type TSubmitProductivityForGroupTimerBody = {
    groupTimerId: string;
    productivityDuration: number; 
};


export const getActiveGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const data = await groupProductivityTimerServices.getUsersActiveGroupProductivityTimers(toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Users's Active Group-Timers fetched successfully !",
        success: true,
        data: data
    })
});


export const respondToGroupTimerInvitation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { groupTimerId, notificationId, status }: {
        groupTimerId: string,
        notificationId: string,
        status: "accepted" | "declined",
    } = req.body;

    if (!groupTimerId || !status) {
        throw ApiError(StatusCodes.BAD_REQUEST, "groupTimerId and status are required !");
    }

    await groupProductivityTimerServices.respondToInvitation(
        toObjectId(groupTimerId),
        toObjectId(userId),
        status
    );

    // ? Tell notification-service to update the invitation's status on the notification doc
    await emitEvent("group.timer.invitation.responded", {
        notificationId,
        userId,
        status,
    });

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Invitation ${status} successfully !`,
        data: null,
    });
});

export const submitProductivityForGroupTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { groupTimerId, productivityDuration }: TSubmitProductivityForGroupTimerBody = req.body;

    if (!groupTimerId) throw ApiError(StatusCodes.BAD_REQUEST, "groupTimerId is required !");
    if (!productivityDuration || productivityDuration <= 0) {
        throw ApiError(StatusCodes.BAD_REQUEST, "productivityDuration must be a positive number of seconds !");
    }

    const updated = await groupProductivityTimerServices.submitProductivityForGroupTimer(
        toObjectId(userId),
        toObjectId(groupTimerId),
        productivityDuration
    );

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Productivity submitted !",
        data: updated,
    });
});

export const getExpiredGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const data = await groupProductivityTimerServices.getUsersExpiredGroupProductivityTimers(toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Expired group timers fetched !",
        success: true,
        data,
    });
});

export const getPendingGroupTimerInvites = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const data = await groupProductivityTimerServices.getPendingInvitesForUser(toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Pending invites fetched !",
        success: true,
        data,
    });
});

