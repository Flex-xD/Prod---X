import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(ApiError(StatusCodes.BAD_REQUEST, "Only image files are allowed !") as any);
    }
    cb(null, true);
};

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).single("avatar");