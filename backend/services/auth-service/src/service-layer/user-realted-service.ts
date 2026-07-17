import mongoose, { Mongoose, Types } from "mongoose";
import User from "../shared/models/User";
import { ApiError } from "../shared/utils/api-error";
import { StatusCodes } from "http-status-codes";
import { getUserOrThrow } from "../shared/utils/user-exists";
import { sendResponse } from "../shared/utils/response-utils";
import { toObjectId } from "../shared/utils/into-objectId";

export const userRelatedService = {
    userData: async (userId: mongoose.Types.ObjectId) => {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }
        return user;
    },
    getUsersForGroupProductivityTimer: async (query: string , userId:string) => {
        const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const regExp = new RegExp(escapedQuery, "i");

        const users = await User.find({
            $or: [
                {
                    email: {
                        $regex: regExp
                    },
                    username: {
                        $regex:regExp
                    }
                } 
            ] , 
            _id:{$ne:new Types.ObjectId(userId)}
        }).select("_id  username email avatar");


        // ? see if you should handle the condition of users being undefined here or in the controller (for now I am handling it in the controller)
        return users;
    },
    getInvitedUserIds: async (userId: mongoose.Types.ObjectId, data: any) => {
        const user = await getUserOrThrow(userId);
    },
}