import { Request, Response } from "express";
import User from "../models/User";
import { hashToken } from "../utils/hash";
import { signAccessToken } from "../utils/generate-token";
import { sendResponse } from "@shared/utils/response-utils";
import { StatusCodes } from "http-status-codes";
import uuidv4 from "uuidv4";

export async function refresh(req: Request, res: Response) {
    const refreshPlain = req.cookies?.refreshToken;
    if (!refreshPlain) return res.status(401).json({ error: "No refresh token" });

    const hashed = hashToken(refreshPlain);
    const user = await User.findOne({ "refreshTokens.hashedToken": hashed });
    if (!user) {
        // Token reuse detected — possible theft:
        // Option: if token decodes and identifies user -> revoke all sessions for that user
        // For our plain-token approach we can't decode; so take conservative approach: log + require full login
        console.warn("Refresh token reuse or invalid token for ip:", req.ip);
        return res.status(401).json({ error: "Invalid refresh token" });
    }

    // find the specific token record
    const tokenRecord = user.refreshTokens.find(rt => rt.hashedToken === hashed);
    if (!tokenRecord) return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Could not find refresh token record !"
    })

    if (new Date(tokenRecord.absoluteExpiresAt) < new Date()) {
        user.refreshTokens = user.refreshTokens.filter(rt => rt.hashedToken !== hashed);
        await user.save();
        res.clearCookie("refreshToken", { path: "/auth/refresh" });
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Refresh token has expired , please login again !"
        })
    }

    user.refreshTokens = user.refreshTokens.filter(rt => rt.hashedToken !== hashed);
    const newAccessToken = signAccessToken({ sub: user._id });
    const newRefreshPlain = `${uuidv4}.${crypto.randomUUID()}`;
    const newHashed = hashToken(newRefreshPlain);

    const newSlidingExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    user.refreshTokens.push({
        hashedToken: newHashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: newSlidingExpires,
        absoluteExpiresAt: tokenRecord.absoluteExpiresAt  
    });
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
