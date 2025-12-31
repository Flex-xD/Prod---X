import { StatusCodes } from "http-status-codes";
import { ApiError, getUser } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import GroupTimer from "../shared/models/GroupTimer";



export const groupProductivityTimerServices = {
    createGroupProductivityTimerService: async (userId :mongoose.Types.ObjectId, data :TcreateGroupProductivityTimerInputForBody) => {
        const user = await getUser(userId);
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }
    const groupProductivityTimer = await GroupTimer.create({
        ...data
    })
    user.userGroupProductivityTimer.push(groupProductivityTimer._id);
    await user.save();
    return groupProductivityTimer;
    }
}