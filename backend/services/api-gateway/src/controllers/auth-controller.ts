import { asyncHandler } from "@shared/utils/async-handler";
import {Request ,Response}  from "express";
import { verifyGoogleAuthToken } from "../utils/googleAuthVerifier";
import { authService } from "../service-layer/auth-service";
import { sendResponse } from "@shared/utils/response-utils";
import { StatusCodes } from "http-status-codes";
import { generateUserToken } from "../utils/generate-token";
import { userType } from "../schemas/user-schema";


// ? REGISER CONTROLLER (Local Auth)
export const registerController = asyncHandler(async (req:Request , res:Response) => {
    const {email , password , username} = req.body;

})

// ? LOGIN CONTROLLER (Local Auth)
export const loginController = asyncHandler(async (req:Request , res:Response) => {
    const {email , password , username} = req.body;

})


// ? GOOGLE AUTH CONTROLLER (Google Auth)
export const googleAuthController  = asyncHandler (async (req:Request , res:Response) =>{ 
    const {id_token} = req.body;
    const googleUser = await verifyGoogleAuthToken(id_token);

    const user:userType = await authService.findOrCreateGoogleUser(googleUser);
    const token = await generateUserToken(user._id!.toString());
    const maxAge:number = 7 * 24 * 60 * 60 * 1000
    res.cookie("token" , token , {
        httpOnly:true , 
        secure:process.env.NODE_ENV === "production" , 
        sameSite:"strict" ,
        maxAge:maxAge
    })
    if (!user) {
        return sendResponse(res , {
            statusCode:400 ,
            message:"User not found !" , 
            success:false
        })
    }
    return sendResponse(res , {
        statusCode:StatusCodes.CREATED , 
        message:"User created successfully !" , 
        data:user ,
        success:true
    })
})