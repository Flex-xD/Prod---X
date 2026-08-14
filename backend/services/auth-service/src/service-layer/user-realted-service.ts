import mongoose, { mongo, Mongoose, Types } from "mongoose";
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
    

 getUsersForGroupProductivityTimer: async (query: string, userId: string) => {
        const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const regExp = new RegExp(escapedQuery, "i");

        const filter = {
            $or: [
                { email: { $regex: regExp } },
                { username: { $regex: regExp } }
            ],
            _id: { $ne: new mongoose.Types.ObjectId(userId) }
        };

        const usersPipeline = [
            {
                $match:filter
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    avatar: 1,
                }
            }
        ];

        const users = await User.aggregate(usersPipeline);
        const totalUsers = await User.countDocuments(filter);
        console.log("These are the users : ", users);
        return {
            users , 
            totalUsers
        };
    },

}