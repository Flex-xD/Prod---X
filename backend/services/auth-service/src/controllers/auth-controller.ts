import { NextFunction, Request, response, Response } from "express";
import { verifyGoogleAuthToken } from "../utils/googleAuthVerifier";
import { authService } from "../service-layer/auth-service";
import { StatusCodes } from "http-status-codes";
import { signAccessToken, signRefreshToken } from "../utils/generate-token";
import { hashToken } from "../utils/hash";
import { asyncHandler } from "../shared/utils/async-handler";
import { sendResponse } from "../shared/utils/response-utils";
import Token from "../shared/models/Token";
import { emitEvent } from "../kafka/producer";
import User from "../shared/models/User";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000
};


// ? REGISTER CONTROLLER (Local Auth)
export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    const user = await authService.registerLocalUser({ email, username, password });

    // ? This token related stuff should all be inside authService.regigsterLocalUser or may be a different service
    const accessToken = signAccessToken({ userId: user._id! });
    const refreshPlain = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
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

    const accessToken = signAccessToken({ userId: user._id });
    const refreshPlain = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
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
    res.cookie("refreshToken", refreshPlain, REFRESH_COOKIE_OPTIONS); // was commented out — this is the fix

    await emitEvent("user.login", { email });

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "User logged in successfully!",
        data: { accessToken, user },
        success: true
    })
});

// ? GOOGLE AUTH CONTROLLER (Google Auth)
export const googleAuthController = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const googleUser = await verifyGoogleAuthToken(idToken);

    const user = await authService.findOrCreateGoogleUser(googleUser);

    if (!user) {
        return sendResponse(res, { statusCode: 400, message: "User not found !", success: false })
    }

    // CHANGED: was signRefreshToken({ sub: ... }) — wrong token type/shape/secret entirely.
    // This must match the same signAccessToken the login/register flows use, or every
    // subsequent API call from a Google-authenticated user fails Bearer verification.
    const accessToken = signAccessToken({ userId: user._id! });

    const refreshPlain = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
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
    res.cookie("refreshToken", refreshPlain, REFRESH_COOKIE_OPTIONS); // was missing entirely before

    await emitEvent("user.login", { email: googleUser.email })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "User created successfully !",
        data: { accessToken, user },
        success: true
    })
})

export const logoutController = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

            return sendResponse(res, {
                statusCode: StatusCodes.OK,
                message: "Logged out successfully!",
                data: null,
                success: true,
            });
        }

        const hashedToken = hashToken(refreshToken);

        const dbToken = await Token.findOne({
            hashedToken,
        });

        if (dbToken) {
            await User.updateOne(
                {
                    refreshTokens: dbToken._id,
                },
                {
                    $pull: {
                        refreshTokens: dbToken._id,
                    },
                }
            );

            await Token.findByIdAndDelete(dbToken._id);
        }

        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            message: "Logged out successfully!",
            data: null,
            success: true,
        });
    }
);

