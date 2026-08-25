import mongoose from "mongoose"
import User from "../../../shared/models/User"
import { getUserOrThrow } from "../../../shared/utils/user-exists"
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
        await User.findByIdAndUpdate(userId,
            { isOnline },
            { new: true, upsert: true }
        )
        console.log("User updated : isActive:true");

    },
    "user.status.offline": async ({ isOnline, userId, lastSeen }: IUserStatusOffline) => {
        await User.findByIdAndUpdate(userId,
            { isOnline, lastSeen },
            { new: true, upsert: true }

        )

        console.log("User updated : isActive:false");

    }
}