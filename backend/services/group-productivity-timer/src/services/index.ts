import { StatusCodes } from "http-status-codes";
import { ApiError, getUser } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import GroupTimer from "../shared/models/GroupTimer";
import { emitEvent } from "../kafka/producer";
// import { getSocket } from "../socket";
// import User from "../shared/models/User";



export const groupProductivityTimerServices = {
    createGroupProductivityTimerService: async (userId: mongoose.Types.ObjectId, data: TcreateGroupProductivityTimerInputForBody) => {
        // ? I am getting the io below ,
        // const io = getSocket();

        const user = await getUser(userId);
        // if (!user) {
        //     throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        // }

        const groupProductivityTimer = new GroupTimer({
            title: data.title,
            body: data.body ? data.body : "",
            deadline: data.deadline,
            invitedUsersId: data.invitedUsersId,
            participants: [],
            specifiedTime: data.specifiedTime,
            author: userId , 
        })

        console.log("This the data that group-timer service is getting : ", data.invitedUsersId);
        
        await emitEvent("group.timer.created", {
            userId ,
            invitedUsersId:data.invitedUsersId
        })

        await groupProductivityTimer.save();
        user.userGroupProductivityTimer.push(groupProductivityTimer._id);
        await user.save();
        return groupProductivityTimer;
    }
}