import { Response } from "express"
import { logger } from "../winston-logger";
export type sendResponseType<T> = {
    statusCode: number,
    success: boolean,
    message: string,
    data?: T
}

export type sendErrorType = {
    statusCode: number,
    success: boolean,
    message: string,
}

export const sendResponse = <T>(
    res: Response,
    { statusCode, success, message, data }: sendResponseType<T>
) => {
    logger.info("✅ Response Sent:", {
        statusCode,
        success,
        message,
        data,
    });

    return res.status(statusCode).json({
        statusCode,
        success,
        message,
        data,
    });
};

export const sendError = (res: Response, {
    statusCode = 500,
    message = "Something went wrong",
    error,
}: {
    statusCode?: number;
    message?: string;
    error?: unknown;
}) => {
    const errorMessage = error instanceof Error ? error.message : message;
    console.log(error);
    logger.error("❌ Error:", errorMessage);
    console.log("Sending response from the sendError utiltiy . . . ")
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message: errorMessage,
        data: null,
    });
};