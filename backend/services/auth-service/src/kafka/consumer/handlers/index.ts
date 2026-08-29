import mongoose from "mongoose"
import User from "../../../shared/models/User"
import { sendResponse } from "../../../shared/utils/response-utils"
import { ApiError } from "../../../shared/utils/api-error"
import { StatusCodes } from "http-status-codes"

interface IUserStatusOnline {
    isOnline: boolean,
    userId: mongoose.Types.ObjectId
}

interface IUserStatusOffline {
    isOnline: boolean,
    userId: mongoose.Types.ObjectId,
    lastSeen: Date
}

export const handlers = {
    "user.status.online": async ({ isOnline, userId }: IUserStatusOnline) => {
        console.log("isOnline : ", isOnline, " userId : ", userId);
        
        await User.findByIdAndUpdate(userId,
            { isOnline },
            { new: true, upsert: true }
        )
        console.log("User updated : isOnline:true");
    },
    "user.status.offline": async ({ isOnline, userId, lastSeen }: IUserStatusOffline) => {
        console.log("isOnline : ", isOnline, " userId : ", userId, " lastseen : ", lastSeen);
        await User.findByIdAndUpdate(userId,
            { isOnline, lastSeen },
            { new: true, upsert: true }
        )

        console.log("User updated : isOnline:false");

    }
}