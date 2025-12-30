import { StatusCodes } from "http-status-codes";
import { ApiError, getUser } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";



export const groupProductivityTimerServices = {
    createGroupProductivityTimerService: async (userId :mongoose.Types.ObjectId, data :TcreateGroupProductivityTimerInputForBody) => {
        const user = await getUser(userId);
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }
    }
}