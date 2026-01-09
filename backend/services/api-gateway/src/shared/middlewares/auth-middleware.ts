import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendError, sendResponse } from "../utils/response-utils";
import { ApiError } from "../utils/api-error";

export interface IAuthRequest extends Request {
    userId?:mongoose.Types.ObjectId;
}

export const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const headers = req.headers.authorization;
        if (!headers) {
            throw ApiError(StatusCodes.UNAUTHORIZED , "Unauthorized - Headers not found !");
        }
        
        const token = headers.split(" ")[1];
        // const token = req.cookies.token;
        if (!token) {
            return sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                message: "JWT Token not found !",
                success: false
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId:mongoose.Types.ObjectId}
        if (!decoded.userId) {
            return sendResponse(res , {
                statusCode:StatusCodes.CONFLICT , 
                message:"Token not decoded !" ,
                success:false
            })
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return sendError(res, { error });
    }
}