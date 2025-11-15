import { asyncHandler } from "@shared/utils/async-handler";
import { Request, Response } from "express";
import { verifyGoogleAuthToken } from "../utils/googleAuthVerifier";
import { authService } from "../service-layer/auth-service";
import { sendResponse } from "@shared/utils/response-utils";
import { StatusCodes } from "http-status-codes";
import { generateUserToken } from "../utils/generate-token";
import { userType } from "../schemas/user-schema";
import User from "../models/User";


// ? REGISER CONTROLLER (Local Auth)

const maxAge: number = 7 * 24 * 60 * 60 * 1000

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const userExists = await User.find({ email });
    if (userExists) {
        return sendResponse(res, {
            statusCode: StatusCodes.CONFLICT,
            success: false,
            message: "User already exists !"
        })
    }
    const user = await authService.registerLocalUser({ ...req.body });
    // ? Hash user's password also
    // VERIFY that do you even need to check this or not ? as this will be handled by the main server file.
    if (!user) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: "User was not able to register , try again later !"
        })
    }

    // hash user's password

    // ! convert user._id to string everywhere or use mongoose _id type ,  see what is more significant in for the future
    const token = await generateUserToken(user._id!.toString());

    res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        maxAge: maxAge
    })
    return sendResponse(res ,{
        statusCode:StatusCodes.CREATED ,
        success:true , 
        data:user , 
        message:"User registered successfully !"
    })

})

// ? LOGIN CONTROLLER (Local Auth)
export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

})


// ? GOOGLE AUTH CONTROLLER (Google Auth)
export const googleAuthController = asyncHandler(async (req: Request, res: Response) => {
    const { id_token } = req.body;
    const googleUser = await verifyGoogleAuthToken(id_token);

    const user: userType = await authService.findOrCreateGoogleUser(googleUser);
    const token = await generateUserToken(user._id!.toString());
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge
    })
    if (!user) {
        return sendResponse(res, {
            statusCode: 400,
            message: "User not found !",
            success: false
        })
    }
    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "User created successfully !",
        data: user,
        success: true
    })
})