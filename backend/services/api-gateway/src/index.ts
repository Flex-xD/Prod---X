import express, { Request, response, Response } from "express";
import dotenv from "dotenv";
import { ApiError, authMiddleware, logger, sendError, sendResponse } from "./shared";
import cors from "cors";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import connectDb from "./shared/config/db";
import axios from "axios";
import { NextFunction } from "http-proxy-middleware/dist/types";
import mongoose from "mongoose";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    const path = req.path.replace(/^\/api\/v1/, "");

    if (path.startsWith("/auth")) {
        return next();
    }

    return authMiddleware(req as Request, res as Response , next as NextFunction);
});


const services = {
    // Later on add the paths to the env file
    "/tasks": "http://localhost:4000/api/v1",
    "/auth": "http://localhost:5000/api/v1",
    "/group-productivity-timer": "http://localhost:9000/api/v1",
    "/notification": "http://localhost:10000/api/v1" , 
} as Record<string, string>;

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

// * Find a way to implement validate middleware in the API-GATEWAY along with the suitable types for different API's  (keep scalability in mind)
app.all(/.*/, async (req: IAuthRequest, res: Response) => {
    const {userId} = req;
    const urlPath = req.path.replace(/^\/api\/v1/, "");
    logger.info(`Normalized path: ${urlPath}`);

    logger.info(`Request received at API-GATEWAY for path: ${urlPath}`);

    const targetService = Object.keys(services).find(serviceKey =>
        urlPath.startsWith(serviceKey)
    );

    if (!targetService) {
        throw ApiError(
            StatusCodes.NOT_FOUND,
            `Service not found ❌ for the requested path : ${req.path}`
        );
    }

    const targetUrl = services[targetService];
    const forwardUrl = targetUrl + urlPath;

    // ! there is this problem where the api-gateway is not able to recognize if it is a valid api end-point even if it matches the target service
    
    try {
        const response = await axios({
            method: req.method,
            url: forwardUrl,
            data: req.body,
            headers: {
                authorization: req.headers.authorization,
                // "x-user-id": (req as any).userId?.toString() , 
                "x-user-id": userId
            },
            validateStatus: () => true
        });

        return sendResponse(res, response.data);
    } catch (error) {
        return sendError(res, { error });
    }
});

app.listen(PORT, async () => {
    await connectDb(MONGODB_URI || "");
    logger.info(`API-GATEWAY ⛩️  is running on PORT:☑️  ${PORT}`);
})