import jwt from "jsonwebtoken";

export const generateUserToken = async (email: string) => {
    return jwt.sign({ id: email }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "7d",
    })
}