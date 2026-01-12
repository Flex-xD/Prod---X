import { Request, Response } from "express";
import { verifyGoogleAuthToken } from "../utils/googleAuthVerifier";
import { authService } from "../service-layer/auth-service";
import { StatusCodes } from "http-status-codes";
import { signAccessToken, signRefreshToken } from "../utils/generate-token";
import { uuidv4 } from "zod";
import { hashToken } from "../utils/hash";
import { asyncHandler } from "../shared/utils/async-handler";
import { sendResponse } from "../shared/utils/response-utils";
import Token from "../shared/models/Token";
import { emitEvent } from "../kafka/producer";

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

    // Check the accessToken below wether it should be of small time or large time
    const accessToken = signAccessToken({ userId: user._id! });
    const refreshPlain = `${uuidv4()}.${crypto.randomUUID()}`;
    const hashed = hashToken(refreshPlain)

    // ? Think about slidingExpiry (I think it should be shorter than absolute expiry)

    const slidingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const absoluteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const refreshToken = await Token.create({
        hashedToken: hashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: slidingExpiresAt,
        absoluteExpiresAt
    })

    user.refreshTokens.push(refreshToken._id);

    await user.save();
    res.cookie("refreshToken", refreshPlain, REFRESH_COOKIE_OPTIONS);

    await emitEvent("user.register", {
        email,
        username
    });

    // Think of omitting the password before sending the response
    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        data: { accessToken, user },
        message: "User registered successfully !"
    })

})

// ? LOGIN CONTROLLER (Local Auth)
export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginLocalUser({ email, password });

    // same as above or should be different ?
    const accessToken = signAccessToken({ userId: user._id });
    const refreshPlain = `${uuidv4()}.${crypto.randomUUID()}`;
    const hashed = hashToken(refreshPlain)

    const slidingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const absoluteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const refreshToken = await Token.create({
        hashedToken: hashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: slidingExpiresAt,
        absoluteExpiresAt
    })

    user.refreshTokens.push(refreshToken._id);
    await user.save();
    res.cookie("refreshToken", refreshPlain, REFRESH_COOKIE_OPTIONS);

    await emitEvent("user.login", {
        email,
    });

    console.log("This is the response of the LoginController : " , { accessToken, user });
    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "User logged in successfully!",
        data: { accessToken, user },
        success: true
    })
});

// ? GOOGLE AUTH CONTROLLER (Google Auth)
// ! STILL NEEDS TESTING
export const googleAuthController = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const googleUser = await verifyGoogleAuthToken(idToken);

    const user = await authService.findOrCreateGoogleUser(googleUser);
    const accessToken = signRefreshToken({ sub: user._id!.toString() });
    const refreshPlain = `${uuidv4()}.${crypto.randomUUID()}`;
    const hashed = hashToken(refreshPlain)

    // ? Think about slidingExpiry 
    const slidingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const absoluteExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const refreshToken = await Token.create({
        hashedToken: hashed,
        userAgent: req.headers["user-agent"] as string,
        ip: req.ip as string,
        expiresAt: slidingExpiresAt,
        absoluteExpiresAt
    })

    user.refreshTokens.push(refreshToken._id);

    await user.save();
    if (!user) {
        return sendResponse(res, {
            statusCode: 400,
            message: "User not found !",
            success: false
        })
    }

    await emitEvent("user.login", {
        email: googleUser.email
    })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "User created successfully !",
        data: { accessToken, user },
        success: true
    })
})

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    // ? See what to do with the refresh tokens in db , whether to delete them or keep them for history
    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Logged out successfully !",
        success: true
    })
})