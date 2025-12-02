import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function signAccessToken(payload: object) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
export function signRefreshToken(payload: object) {
    console.log("This is access secret : ", ACCESS_SECRET, "and this is REFRESH_SECRET", REFRESH_SECRET);
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET);
}
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET);
}
