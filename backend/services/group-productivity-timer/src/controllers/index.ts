import mongoose, { Mongoose, Types } from "mongoose";
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

    const { title, body, deadline, specifiedTime, invitedUsersId }: TcreateGroupProductivityTimerInputForBody = req.body;

    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
    }

    if (invitedUsersId.length == 0) {
        throw ApiError(StatusCodes.BAD_REQUEST , "You must invite at least one user !");
    }

    const groupProductivityTimer = await groupProductivityTimerServices.createGroupProductivityTimerService(toObjectId(userId), { title, body, deadline, specifiedTime, invitedUsersId } as TcreateGroupProductivityTimerInputForBody);
    logger.info(`Sending Response to client ✅ with userid: ${userId}`);
    
    //  * have to emit the socket.io event here , and then listen for it on the frontend and on being listened , it will initaite a notification for the users whenever he will connect to the server . . .
    
    await emitEvent("group.timer.created", {
        userId,
        invitedUsersId,
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

