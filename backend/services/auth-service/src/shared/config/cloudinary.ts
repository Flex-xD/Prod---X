import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";

let configured = false;

const REQUIRED_ENV = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const;

export const getCloudinary = () => {
    // * Fail with an explicit message instead of letting the SDK throw a
    // * cryptic "API key not found"-style error during an avatar upload.
    const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
    if (missing.length) {
        throw ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Avatar upload is not configured on the server: missing ${missing.join(", ")} in the auth-service environment (.env).`
        );
    }

    if (!configured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        configured = true;
    }
    return cloudinary;
};