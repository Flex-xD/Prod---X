import { Mongoose, Types } from "mongoose";
import User from "../shared/models/User";
import { ApiError } from "../shared/utils/api-error";
import { StatusCodes } from "http-status-codes";

export const userRelatedService = {
    userData: async (userId: Types.ObjectId) => {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }
        return user;

    }
}