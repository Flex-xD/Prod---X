import { sendResponse } from "@shared/utils/response-utils";
import User from "../models/User"
import { loginType, registerType } from "../schemas/user-schema";
import { StatusCodes } from "http-status-codes";

export const authService = {
    findOrCreateGoogleUser: async (googleUser: any) => {
        let user = await User.findById({ email: googleUser.email });
        if (!user) {
            user = await User.create({
                username: googleUser.name,
                email: googleUser.email,
                userTodos:[] ,
                provider: "google",
                avatar: googleUser.profilePicture
            })
        }
        return user;
    },
    registerLocalUser: async (body:registerType) => {
        const user = await User.create({
            ...body , 
            provider:"local" , 
            userTodos:[] , 
            avatar:"" , 
        })
        return user;
    },
    loginLocalUser: async (body:loginType) => {
  // remember to put provider:local
    }
}