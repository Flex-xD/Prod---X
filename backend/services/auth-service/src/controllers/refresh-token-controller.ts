import { Request, Response } from "express";
import { hashToken } from "../utils/hash";
import { signAccessToken } from "../utils/generate-token";
import { StatusCodes } from "http-status-codes";
import uuidv4 from "uuidv4";
import { sendResponse } from "../shared/utils/response-utils";
import User from "../shared/models/User";
import Token from "../shared/models/Token";


export async function refresh(req: Request, res: Response) {
    const refreshPlain = req.cookies?.refreshToken;
    if (!refreshPlain) return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "No refresh plain token found !"
    })

    const hashed = hashToken(refreshPlain);
    const user = await User.findOne({ "refreshTokens.hashedToken": hashed });
    if (!user) {
        // Token reuse detected — possible theft:
        // Option: if token decodes and identifies user -> revoke all sessions for that user
        // For our plain-token approach we can't decode; so take conservative approach: log + require full login
        console.warn("Refresh token reuse or invalid token for ip:", req.ip);
        return res.status(401).json({ error: "Invalid refresh token" });
    }

    const userRefreshToken = await Token.findOne({ hashedToken: hashed });
    if (!userRefreshToken) {
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Could not find refresh token!"
        })
    }
    // find the specific token record
    // const tokenRecord = user.refreshTokens.find(rt => rt.hashedToken === hashed);

    // ?check wether the token record is even valuable or not
    // const tokenRecord = userRefreshToken?.hashedToken === hashed;
    // if (!tokenRecord) return sendResponse(res, {
    //     statusCode: StatusCodes.UNAUTHORIZED,
    //     success: false,
    //     message: "Could not find refresh token record !"
    // })

    if (new Date(userRefreshToken?.absoluteExpiresAt) < new Date()) {
        user.refreshTokens = user.refreshTokens.filter(rt => rt !== userRefreshToken._id);
        await user.save();
        res.clearCookie("refreshToken", { path: "/auth/refresh" });
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Refresh token has expired , please login again !"
        })
    }

    // ? Check wether this line provides any value or not
    user.refreshTokens = user.refreshTokens.filter(rt => rt !== userRefreshToken._id);

    const newAccessToken = signAccessToken({ sub: user._id });
    const newRefreshPlain = `${uuidv4}.${crypto.randomUUID()}`;
    const newHashed = hashToken(newRefreshPlain);

    const newSlidingExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const newRefreshToken = await Token.create({
        hashedToken: newHashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: newSlidingExpires,
        // ? check wether the newRefreshToken absolute expiry should be same as old one or not
        absoluteExpiresAt: userRefreshToken.absoluteExpiresAt
    })

    user.refreshTokens.push(newRefreshToken._id);
    await user.save();

    res.cookie("refreshToken", newRefreshPlain, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Token refreshed successfully !",
        data: { accessToken: newAccessToken }
    })
}
