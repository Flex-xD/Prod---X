import { NextFunction  , Request , Response} from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";

export const internalServiceAuth = async (req:Request , res:Response , next:NextFunction) => {
    const serviceKey = req.headers["x-service-key"];
    if (!serviceKey || serviceKey !== process.env.PRODX_SERVICE_KEY) {
        throw ApiError(StatusCodes.FORBIDDEN,  "Forbidden: Unauthorized service=ey !");
    }
    return next();
}