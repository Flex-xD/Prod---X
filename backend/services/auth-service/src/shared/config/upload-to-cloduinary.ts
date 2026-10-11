import streamifier from "streamifier";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";
import { getCloudinary } from "./cloudinary";

export const uploadBufferToCloudinary = (buffer: Buffer, folder: string = "prodx/avatars") => {
    return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = getCloudinary().uploader.upload_stream(
            { folder, resource_type: "image", transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }] },
            (error, result) => {
                if (error || !result) return reject(ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Avatar upload failed !"));
                resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    try { await getCloudinary().uploader.destroy(publicId); } catch {  }
};