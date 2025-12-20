import User, { IUser } from "../../models/User";
import { Types } from "mongoose";


export const getUser = async (userId: Types.ObjectId): Promise<IUser> => {
    const user = await User.findById(userId).select("_id username avatar");
    return user as IUser;
}