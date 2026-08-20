import { StatusCodes } from "http-status-codes";
import { ApiError, getUser, sendResponse } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import GroupTimer from "../shared/models/GroupTimer";
import { emitEvent } from "../kafka/producer";
import User from "../shared/models/User";
import { userInfo } from "os";

export const groupProductivityTimerServices = {
    createGroupProductivityTimerService: async (userId: mongoose.Types.ObjectId, data: TcreateGroupProductivityTimerInputForBody) => {

        // const user = await getUser(userId);

        const groupProductivityTimer = new GroupTimer({
            title: data.title,
            body: data.description ? data.description : "",
            deadline: data.deadline,
            invitedUsersId: data.invitedUsersId,
            participants: [],
            specifiedTime: data.specifiedTime,
            author: userId,
        })

        console.log("This the data that group-timer service is getting : ", data.invitedUsersId);

        await groupProductivityTimer.save();

        await User.findByIdAndUpdate(userId, {
            $push: {
                userGroupProductivityTimer: groupProductivityTimer._id
            }
        });

        return groupProductivityTimer;
    },
    getUsersActiveGroupProductivityTimers: async (userId: mongoose.Types.ObjectId) => {
        const filter = {
            isActive: true,
            $or: [
                {
                    author:userId
                },
                {
                    participants:userId
                }
            ]
        }

        const activeGroupProductivityTimers = await GroupTimer.find(filter);

        if (activeGroupProductivityTimers.length == 0) {
            throw ApiError(StatusCodes.NOT_FOUND, "User has not created or joined any group-productivity-timers yet !");
        }

        const totalGroupTimers = activeGroupProductivityTimers.length;

        return {
            activeGroupProductivityTimers,
            totalGroupTimers
        }
    }
}