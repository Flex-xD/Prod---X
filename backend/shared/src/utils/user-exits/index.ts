import { StatusCodes } from "http-status-codes";
import User from "../../models/User";
import { Response } from "express";
import { ApiError } from "../api-error";
import { Types } from "mongoose";

export const getUserOrThrow = async (userId: Types.ObjectId) => {
    const user = await User.findById(userId).select("_id username avatar");
    if (!user) {
        throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
    }
    return user;
}