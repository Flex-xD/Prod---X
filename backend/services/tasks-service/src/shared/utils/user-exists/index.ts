import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../../models/User";
import { ApiError } from "../api-error";
import { Types } from "mongoose";


export const getUser = async (userId: Types.ObjectId): Promise<IUser> => {
    const user = await User.findById(userId).select("_id username avatar");
    return user as IUser;
}