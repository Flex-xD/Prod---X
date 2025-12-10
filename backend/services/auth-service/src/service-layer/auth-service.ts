import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import User from "../shared/src/models/User";
import { loginType, registerType } from "../shared/src/schemas/user-schema";
import { ApiError } from "../shared/src/utils/api-error";

export const authService = {
    findOrCreateGoogleUser: async (googleUser: any) => {
        let user = await User.findOne({ email: googleUser.email });
        console.log("This is google user: " ,googleUser);
        if (!user) {
            user = await User.create({
                ...googleUser
            })
        }
        return user;
    },
    registerLocalUser: async (body: registerType) => {
        const userExists = await User.findOne({ email: body.email });
        if (userExists) {
            throw ApiError(StatusCodes.CONFLICT, "User already exists !");
        }
        const user = await User.create({
            ...body,
            provider: "local",
            userTasks: [],
            userProductivityTimers: [],
            avatar: "",
        })
        return user;
    },

    loginLocalUser: async (body: loginType) => {
        const user = await User.findOne({ email: body.email, provider: "local" });
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found ! Invalid email or password !");
        }
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            throw ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password !");
        }
        return user;
    }
}