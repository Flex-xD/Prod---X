import crypto from "crypto";
import { Request } from "express";
import mongoose from "mongoose";
import { hashToken } from "../../../utils/hash";
import Token from  "../../models/Token"

const REFRESH_TOKEN_DAYS = 30;

export const getRefreshExpiry = (days: number): Date =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export const generateRefreshToken = async (
    req: Request,
    session?: mongoose.ClientSession
) => {
    const plainToken = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
    const hashedToken = hashToken(plainToken);

    const expiresAt = getRefreshExpiry(REFRESH_TOKEN_DAYS);
    const absoluteExpiresAt = getRefreshExpiry(REFRESH_TOKEN_DAYS);

    const [token] = await Token.create(
        [
            {
                hashedToken,
                userAgent: req.headers["user-agent"],
                ip: req.ip,
                expiresAt,
                absoluteExpiresAt,
            },
        ],
        session ? { session } : undefined
    );

    return {
        plainToken,
        token,
    };
};