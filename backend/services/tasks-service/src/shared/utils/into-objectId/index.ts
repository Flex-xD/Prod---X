import { Types } from "mongoose";
import { ApiError } from "../api-error";
import { StatusCodes } from "http-status-codes";

export const toObjectId = (id: string): Types.ObjectId  => {
    console.log("This is the ID : " , id);
    if (!Types.ObjectId.isValid(id)) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Invalid ID format");
    }
    return new Types.ObjectId(id);
}