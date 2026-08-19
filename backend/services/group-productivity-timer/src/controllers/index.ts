import mongoose, { Mongoose, Types } from "mongoose";
import { ApiError, asyncHandler, getUser, logger, sendResponse, toObjectId } from "../shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";
import { groupProductivityTimerServices } from "../services";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import { create } from "domain";

// ? In this controller the timer is being created for a group , now I have to also add the user inviting logic into this 

export const createGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    // ? May be I can remove the as string from below ???
    const userId = req.headers["x-user-id"] as string;

    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, description, deadline, specifiedTime, invitedUsersId }: TcreateGroupProductivityTimerInputForBody = req.body;

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

export const getActiveProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    // ? we can also check weather the user already have 5 {isActive:true} group-timers
    // ? and if he has then return form here 

    const data = groupProductivityTimerServices.getUsersActiveGroupProductivityTimers(toObjectId(userId));

    return sendResponse(res , {
        statusCode:StatusCodes.OK ,
        message:"Users's Active Group-Timers fetched successfully !" ,
        success:true  ,
        data:(await data).activeGroupProductivityTimers
    })
    // ? It's main function is to return active group-timers
    // ? at a time a user can have a maximum of 5 active group-timers
    // ? in DB at a timer there could be a maximum of 5 group-timers with { isActive : true}
    // ? and every other as false
    // ? fetch the timers in terms of being latest created
    // ?

})