import { StatusCodes } from "http-status-codes";
import { ApiError } from "../api-error";
import { Types } from "mongoose";
import User from "../../models/User";

type UserPreview = { _id: Types.ObjectId; username: string; avatar?: string | null };

export const getUserOrThrow = async (userId: Types.ObjectId): Promise<UserPreview> => {
    // ? maybe I can get the whole user here 
    const user = await User.findById(userId).select("_id username avatar");
    if (!user) {
        throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
    }
    return user as unknown as UserPreview;
}