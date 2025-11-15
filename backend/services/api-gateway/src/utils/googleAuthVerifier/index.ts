import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleAuthToken = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload() as TokenPayload;
    if (!payload) {
        throw new Error("Invalid Token !")
    }

    return {
        email: payload.email!,
        nameme: payload.name!,
        avatar: payload.picture,
        provider:"google" ,
        userTodos:[]
       // email_verified: payload.email_verified,
    };
}