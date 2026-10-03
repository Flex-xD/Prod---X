import streamifier from "streamifier";
import { StatusCodes } from "http-status-codes";
import cloudinary from "./cloudinary";
import { ApiError } from "../utils/api-error";

export const uploadBufferToCloudinary = (
    buffer: Buffer,
    folder: string = "prodx/avatars"
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
            },
            (error: any, result: any) => {
                if (error || !result) {
                    return reject(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Avatar upload failed !"));
                }
                resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch {
    }
};