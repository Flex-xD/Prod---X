import { StatusCodes } from "http-status-codes";
import User from "../../models/User";
import { ApiError } from "../api-error";
import { Types } from "mongoose";

type UserPreview = { _id: Types.ObjectId; username: string; avatar?: string | null };

export const getUserOrThrow = async (userId: Types.ObjectId): Promise<UserPreview> => {
    const user = await User.findById(userId).select("_id username avatar");
    if (!user) {
        throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
    }
    return user as unknown as UserPreview;
}