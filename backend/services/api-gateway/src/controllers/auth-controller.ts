import { asyncHandler } from "@shared/src/utils/async-handler";
import { Request, Response } from "express";
import { verifyGoogleAuthToken } from "../utils/googleAuthVerifier";
import { authService } from "../service-layer/auth-service";
import { StatusCodes } from "http-status-codes";
import { signRefreshToken } from "../utils/generate-token";
import { uuidv4 } from "zod";
import { hashToken } from "../utils/hash";
import { logger } from "@shared/src/utils/winston-logger";
import { sendResponse } from "@shared/src/utils/response-utils";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/auth/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000
};

// ? REGISTER CONTROLLER (Local Auth)
export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    const user = await authService.registerLocalUser({ email, username, password });

    // ! convert user._id to string everywhere or use mongoose _id type ,  see what is more significant in for the future
    const accessToken = signRefreshToken({ sub: user._id!.toString() });
    const refreshPlain = `${uuidv4()}.${crypto.randomUUID()}`;
    const hashed = hashToken(refreshPlain)

    // ? Think about slidingExpiry (I think it should be shorter than absolute expiry)

    const slidingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const absoluteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({
        hashedToken: hashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: slidingExpiresAt,
        absoluteExpiresAt
    });
    await user.save();
    res.cookie("refreshToken", refreshPlain, REFRESH_COOKIE_OPTIONS);
    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        data: { accessToken, user },
        message: "User registered successfully !"
    })

})

// ? LOGIN CONTROLLER (Local Auth)
export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const user = await authService.loginLocalUser({ email, password });
    const accessToken = signRefreshToken({ sub: user._id!.toString() });
    const refreshPlain = `${uuidv4()}.${crypto.randomUUID()}`;
    const hashed = hashToken(refreshPlain)

    const slidingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const absoluteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({
        hashedToken: hashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: slidingExpiresAt,
        absoluteExpiresAt
    })
    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "User logged in successfully!",
        data: { accessToken, user },
        success: true
    })
})


// ? GOOGLE AUTH CONTROLLER (Google Auth)
export const googleAuthController = asyncHandler(async (req: Request, res: Response) => {
    const { id_token } = req.body;
    const googleUser = await verifyGoogleAuthToken(id_token);

    const user = await authService.findOrCreateGoogleUser(googleUser);
    const accessToken = signRefreshToken({ sub: user._id!.toString() });
    const refreshPlain = `${uuidv4()}.${crypto.randomUUID()}`;
    const hashed = hashToken(refreshPlain)

    // ? Think about slidingExpiry 
    const slidingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const absoluteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({
        hashedToken: hashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: slidingExpiresAt,
        absoluteExpiresAt
    })
    await user.save();
    if (!user) {
        return sendResponse(res, {
            statusCode: 400,
            message: "User not found !",
            success: false
        })
    }
    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "User created successfully !",
        data: { accessToken, user },
        success: true
    })
})