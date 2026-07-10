import { StatusCodes } from "http-status-codes";
import { ApiError, getUser } from "../shared";
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
            body: data.body ? data.body : "",
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
    }
}