import { Socket } from "socket.io"
import { ApiError } from "../shared";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";

export interface IAuthedSocket extends Socket {
    userId?:string
}

const authedSocketMiddleware = async (socket:IAuthedSocket , next:NextFunction) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("token : " ,token);
            throw ApiError(StatusCodes.UNAUTHORIZED , "Unauthorized access !")
        };
        // console.log("This is the token in the Socket-Middleware : " , token);
        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET as string) as {userId:string};
        if (!decoded.userId) {
            throw ApiError(StatusCodes.UNAUTHORIZED , "Unauthorized access !")
        }
        // console.log("Decoded UserId : " , decoded.userId);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        throw ApiError(StatusCodes.UNAUTHORIZED , "Unauthorized access !");
    }
}

export default authedSocketMiddleware;