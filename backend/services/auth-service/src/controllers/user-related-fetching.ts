import { StatusCodes } from "http-status-codes";
import { IAuthRequest } from "../shared/middlewares/auth-middleware";
import { ApiError } from "../shared/utils/api-error";
import { asyncHandler } from "../shared/utils/async-handler";
import { Request ,Response } from "express";
import { userRelatedService } from "../service-layer/user-realted-service";

// ! USER-RELATED-FETCHING
export const userDataController = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const {userId} = req;
    if (!userId) {
        throw ApiError(StatusCodes.UNAUTHORIZED , "You are not Authorized !");
    }
    const userData = await userRelatedService.userData(userId);
    return userData;
})