import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../shared/models/User";
import { z } from "zod";
import { profileAggregationService } from "../service-layer/profile-aggreagtion-service";
import { deleteFromCloudinary, uploadBufferToCloudinary } from "../shared/config/upload-to-cloduinary";
import { ApiError } from "../shared/utils/api-error";
import { asyncHandler } from "../shared/utils/async-handler";
import { toObjectId } from "../shared/utils/into-objectId";
import { sendResponse } from "../shared/utils/response-utils";

const getUserIdOrThrow = (req: Request): string => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    return userId;
};

export const getProfileData = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);

    const [user, stats] = await Promise.all([
        User.findById(toObjectId(userId)).select("-password -refreshTokens"),
        profileAggregationService.getFullProfileStats(userId),
    ]);

    if (!user) throw ApiError(StatusCodes.NOT_FOUND, "User not found !");

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Profile data fetched !",
        data: { user, stats },
    });
});

const updateUsernameSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(24, "Username must be under 24 characters"),
});

export const updateUsername = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);

    const parsed = updateUsernameSchema.safeParse(req.body);
    if (!parsed.success) {
        throw ApiError(StatusCodes.BAD_REQUEST, parsed.error.issues[0]?.message ?? "Invalid username");
    }

    const existing = await User.findOne({ username: parsed.data.username, _id: { $ne: toObjectId(userId) } });
    if (existing) throw ApiError(StatusCodes.CONFLICT, "Username already taken !");

    const user = await User.findByIdAndUpdate(
        toObjectId(userId),
        { username: parsed.data.username },
        { new: true }
    ).select("-password -refreshTokens");

    if (!user) throw ApiError(StatusCodes.NOT_FOUND, "User not found !");

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Username updated successfully !",
        data: user,
    });
});

export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserIdOrThrow(req);

    if (!req.file) throw ApiError(StatusCodes.BAD_REQUEST, "No image file provided !");

    const user = await User.findById(toObjectId(userId));
    if (!user) throw ApiError(StatusCodes.NOT_FOUND, "User not found !");

    const oldPublicId = user.avatarPublicId;

    const { secure_url, public_id } = await uploadBufferToCloudinary(req.file.buffer);

    user.avatar = secure_url;
    user.avatarPublicId = public_id;
    await user.save();

    // ? Clean up the previous avatar asset after the new one is confirmed saved
    if (oldPublicId) await deleteFromCloudinary(oldPublicId);

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Avatar updated successfully !",
        data: { avatar: user.avatar },
    });
});