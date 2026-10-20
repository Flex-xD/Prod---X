import { OAuth2Client, TokenPayload } from "google-auth-library";
import { ApiError } from "../../shared/utils/api-error";
import { StatusCodes } from "http-status-codes";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleAuthToken = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload() as TokenPayload;
    if (!payload) {
        throw ApiError(StatusCodes.UNAUTHORIZED , "Invalid Token !");
    }
    return {
        email: payload.email!,
        username: payload.name!,
        avatar: payload.picture,
        provider: "google",
        userTodos: [],
        refreshTokens: [],
        userProductivityTimers: []
        // email_verified: payload.email_verified,
    };
}