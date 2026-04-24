import { StatusCodes } from "http-status-codes";
import { IAuthRequest } from "../shared/middlewares/auth-middleware";
import { ApiError } from "../shared/utils/api-error";
import { asyncHandler } from "../shared/utils/async-handler";
import { Response } from "express";
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
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User data fetched successfully !",
        data: userData
    })
})