import { StatusCodes } from "http-status-codes";
import { IAuthRequest } from "../shared/middlewares/auth-middleware";
import { ApiError } from "../shared/utils/api-error";
import { asyncHandler } from "../shared/utils/async-handler";
import { response, Response } from "express";
import { userRelatedService } from "../service-layer/user-realted-service";
import { sendResponse } from "../shared/utils/response-utils";
import mongoose from "mongoose";
import { IAMAuth } from "google-auth-library";

// ! USER-RELATED-FETCHING
export const userDataController = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const newUserObjectId = new mongoose.Types.ObjectId(userId);
    const userData = await userRelatedService.userData(newUserObjectId);

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User data fetched successfully !",
        data: userData
    })
});

export const getUsersForGroupProductivityTimer = asyncHandler(async (req: IAuthRequest, res: Response) => {
    // ? let's test this API
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const {query}  = req.query as { query: string };
    console.log(query);
    console.log("This is the query : " , query);
    // ? Fix this , query is not being trimmed because it is not being able to be passed down the API URL
    // if (!query.trim) {
    //     // ? see if the parameter condiion is right or not
    //     throw ApiError(StatusCodes.BAD_REQUEST, "Query not found !");
    // }
    const usersToInvite = await userRelatedService.getUsersForGroupProductivityTimer(query , userId);
    if (usersToInvite.length == 0) {
        return sendResponse(res, {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            data: null,
            message: "User not found !"
        });
    }

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        data: usersToInvite,
        message: "Users found with the following query !"
    });
});


export const inviteUserToGroupTimer = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const usersToInvite:string[] = req.body;
    if (usersToInvite.length == 0) {
        throw ApiError(StatusCodes.CONFLICT , "User ID's are required !");
    };
    for (let i = 0 ; i < usersToInvite.length ; i++) {
        console.log("I will be running the POST /users/invite:id api here untill all the users are being invited");
    }
    // ? It's main purpose is to invite a single user in the invitation modal to the group timer
    // ? I can use a loop to make this api go again and again till the total number of users are being invited;
})