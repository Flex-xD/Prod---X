import { Types } from "mongoose";
import User, { IUser } from "../../models/User";
import { ApiError } from "../api-error";
import { StatusCodes } from "http-status-codes";


export const getUser = async (userId: Types.ObjectId): Promise<IUser> => {

    //  ? const user = await User.findById(userId).select("_id username avatar");

    const user = await User.findById(userId);
    if (!user) {
        throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
    }
    return user as IUser;
}