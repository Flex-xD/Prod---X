import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../../models/User";
import { ApiError } from "../api-error";

import { Request } from "express";


const getUserIdOrThrow = (req: Request): string => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    return userId;
};