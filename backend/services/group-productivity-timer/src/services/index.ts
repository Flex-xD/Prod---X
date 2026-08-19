import { StatusCodes } from "http-status-codes";
import { ApiError, getUser, sendResponse } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import GroupTimer from "../shared/models/GroupTimer";
import { emitEvent } from "../kafka/producer";
import User from "../shared/models/User";

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

        // * here also imply the condition that either author should have the userId or 
        // * participants should include userId
        // * this way we are ensuring that there only user related timers are fetched 
        const activeGroupProductivityTimers = await GroupTimer.find(
            {  $or:[
                
            ],
                isActive:true 
            }
        );
        // ? Decide when group-timer is being marked done and when we have to mark it done

        if (activeGroupProductivityTimers) {
            throw ApiError(StatusCodes.NOT_FOUND, "User has not created or joined any group-productivity-timers yet !");
        }


        const totalGroupTimers = await GroupTimer.countDocuments(activeGroupProductivityTimers);

        return {
            activeGroupProductivityTimers,
            totalGroupTimers
        }
    }
}