import { Request, Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import Token from "../shared/models/Token";
import User from "../shared/models/User";
import { hashToken } from "../utils/hash";
import { signAccessToken } from "../utils/generate-token";
import { sendResponse } from "../shared/utils/response-utils";
import { ApiError } from "../shared/utils/api-error";
import { generateRefreshToken } from "../shared/utils/refresh-token";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

export async function refresh(req: Request, res: Response) {
    const refreshPlain = req.cookies?.refreshToken;

    if (!refreshPlain) {
        throw ApiError(
            StatusCodes.UNAUTHORIZED,
            "Refresh token not found."
        );
    }

    const hashedToken = hashToken(refreshPlain);
    const session = await mongoose.startSession();

    try {
        let accessToken = "";
        let newRefreshPlain = "";

        
        await session.withTransaction(async () => {
            const oldToken = await Token.findOne({
                hashedToken,
            }).session(session);

            if (!oldToken) {
                throw ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "Invalid or already-used refresh token."
                );
            }

            const now = new Date();

            if (
                oldToken.expiresAt <= now ||
                oldToken.absoluteExpiresAt <= now
            ) {
                await Token.deleteOne(
                    { _id: oldToken._id },
                    { session }
                );

                await User.updateOne(
                    { refreshTokens: oldToken._id },
                    {
                        $pull: {
                            refreshTokens: oldToken._id,
                        },
                    },
                    { session }
                );

                throw ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "Refresh token has expired. Please login again."
                );
            }

            const user = await User.findOne({
                refreshTokens: oldToken._id,
            }).session(session);

            if (!user) {
                throw ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "Refresh token is invalid."
                );
            }

            const deletedToken = await Token.findOneAndDelete(
                {
                    _id: oldToken._id,
                    hashedToken,
                },
                {
                    session,
                }
            );

            if (!deletedToken) {
                throw ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "Refresh token has already been used."
                );
            }

            const generated = await generateRefreshToken(req, session);

            generated.token.absoluteExpiresAt =
                oldToken.absoluteExpiresAt;

            generated.token.expiresAt = new Date(
                Math.min(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                    oldToken.absoluteExpiresAt.getTime()
                )
            );

            await generated.token.save({ session });

            user.refreshTokens = user.refreshTokens.filter(
                (tokenId) => !tokenId.equals(oldToken._id)
            );

            user.refreshTokens.push(generated.token._id);

            await user.save({ session });

            accessToken = signAccessToken({
                userId: user._id,
            });

            newRefreshPlain = generated.plainToken;
        });

        res.cookie(
            "refreshToken",
            newRefreshPlain,
            REFRESH_COOKIE_OPTIONS
        );

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Token refreshed successfully.",
            data: {
                accessToken,
            },
        });
    } finally {
        await session.endSession();
    }
}