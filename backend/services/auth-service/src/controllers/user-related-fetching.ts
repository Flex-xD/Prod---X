import { StatusCodes } from "http-status-codes";
import { IAuthRequest } from "../shared/middlewares/auth-middleware";
import { ApiError } from "../shared/utils/api-error";
import { asyncHandler } from "../shared/utils/async-handler";
import {  Response } from "express";
import { userRelatedService } from "../service-layer/user-realted-service";
import { sendResponse } from "../shared/utils/response-utils";
import mongoose from "mongoose";

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
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const {query}  = req.query as { query: string };
    console.log("This is the query : " , query);
    if (!query.trim()) {
        // ? see if the parameter condiion is right or not
        throw ApiError(StatusCodes.BAD_REQUEST, "Query not found !");
    }
    
    const data = await userRelatedService.getUsersForGroupProductivityTimer(query , userId);
    if (data.totalUsers == 0) {
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
        data: data,
        message: "Users found with the following query !"
    });
});


