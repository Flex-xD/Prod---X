import mongoose, { Mongoose, Types } from "mongoose";
import { ApiError, asyncHandler, getUser, logger, sendResponse, toObjectId } from "../shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";
import { groupProductivityTimerServices } from "../services";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import User, { IUser } from "../shared/models/User";

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

// ? In this controller the timer is being created for a group , now I have to also add the user inviting logic into this 

export const createGroupProductivityTimer = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, body, deadline, specifiedTime, invitedUsersId }: TcreateGroupProductivityTimerInputForBody = req.body;

    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
    }

    let invitedUsers: Array<IUser | null> = [];

    for (let i = 0; i < invitedUsers.length; i++) {
        const invitedUser: IUser | null = await User.findById(toObjectId(invitedUsersId[i]));
        invitedUsers.push(invitedUser);
    }


    console.log("Invited Users 👤 : ", invitedUsers);


    const groupProductivityTimer = await groupProductivityTimerServices.createGroupProductivityTimerService(userId, { title, body, deadline, specifiedTime , invitedUsersId} as TcreateGroupProductivityTimerInputForBody);
    logger.info(`Sending Response to client ✅ with userid: ${userId}`);

    await emitEvent("group.timer.created", {
        userId: userId,
        groupProductivityTimer 
    })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Group-roductivity-Timer created successfully !",
        data: groupProductivityTimer
    })

})