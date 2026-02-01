import { NextFunction  , Request , Response} from "express";
import { ApiError } from "../shared";
import { StatusCodes } from "http-status-codes";

export const internalServiceAuth = async (req:Request , res:Response , next:NextFunction) => {
    const serviceKey = req.headers["x-service-key"];
    if (!serviceKey || serviceKey !== process.env.PRODX_SERVICE_KEY) {
        throw ApiError(StatusCodes.FORBIDDEN,  "Forbidden: Unauthorized service=ey !");
    }
    return next();
}