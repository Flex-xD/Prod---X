import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ApiError, authMiddleware, logger, sendError, sendResponse } from "./shared";
import cors from "cors";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import connectDb from "./shared/config/db";
import axios from "axios";
import { NextFunction } from "http-proxy-middleware/dist/types";
import mongoose from "mongoose";
import { INTERNAL_ROUTES, USER_ROUTES } from "./service-routes";
import { internalServiceAuth } from "./shared/middlewares/internal-auth-middleware";
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

// CHANGED: express.json() now skips multipart requests entirely, so the raw body stream
// (and its multipart boundary) survives intact for the proxy handler to forward downstream.
// Every other content type (application/json, no body, etc.) is handled exactly as before.
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.is("multipart/form-data")) {
        return next();
    }
    return express.json()(req, res, next);
});

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

app.use((req: IAuthRequest, res: Response, next: NextFunction) => {
    const path = req.path.replace(/^\/api\/v1/, "");

    if (path.startsWith("/auth")) {
        return next();
    }

    if (INTERNAL_ROUTES.some(route => path.startsWith(route))) {
        return internalServiceAuth(req, res, next);
    }

    if (USER_ROUTES.some(route => path.startsWith(route))) {
        return authMiddleware(req, res, next);
    }

    return next();
});


const services = {
    // Later on add the paths to the env file
    "/task": "http://localhost:4000/api/v1",
    "/user": "http://localhost:5000/api/v1",
    "/auth": "http://localhost:5000/api/v1",
    "/group-productivity-timer": "http://localhost:9000/api/v1",
    "/productivity-timer": "http://localhost:6000/api/v1",
    "/notification": "http://localhost:10000/api/v1",
    "/dashboard": "http://localhost:7000/api/v1",
    "/profile": "http://localhost:5000/api/v1", // CHANGED: new — profile lives inside auth-service
} as Record<string, string>;


app.all(/.*/, async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    const urlPath = req.path.replace(/^\/api\/v1/, "");

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
    console.log("forward URL :", forwardUrl);

    // CHANGED: detect multipart requests so we know to forward the raw stream instead of
    // the (now correctly-skipped, therefore empty/undefined) parsed JSON body.
    const isMultipart = req.is("multipart/form-data");

    try {
        const response = await axios({
            method: req.method,
            url: forwardUrl,
            // CHANGED: for multipart, `req` itself (the raw http.IncomingMessage) is passed
            // as the body — axios streams it through as-is in Node, preserving the original
            // multipart boundary and binary content. For everything else, behavior is unchanged.
            data: isMultipart ? req : req.body,
            params: req.query,
            headers: {
                authorization: req.headers.authorization,
                "x-user-id": userId?.toString(),
                "x-service-key": req.headers["x-service-key"],
                cookie: req.headers.cookie,
                // CHANGED: forward the original content-type (including the multipart boundary
                // string) so the downstream service's multer can correctly parse it.
                ...(isMultipart ? { "content-type": req.headers["content-type"] } : {}),
            },
            // CHANGED: image uploads can exceed axios's conservative defaults — remove the cap
            // rather than have large-but-valid avatar uploads silently truncate or error.
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true
        });

        if (response.data?.data?.refreshToken) {
            console.log("Sending cookie through api-gateway")
            res.cookie("refreshToken", response.data.data.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
            });
            console.log("Cookie sent . . . ");
        }

        console.log("🔥 DOWNSTREAM STATUS:", response.status);
        console.log("🔥 DOWNSTREAM DATA:", response.data);

        return res
            .status(response.status)
            .json(response.data);

    } catch (error) {
        return sendError(res, { error });
    }
});

app.listen(PORT, async () => {
    await connectDb(MONGODB_URI || "");
    logger.info(`API-GATEWAY ⛩️ is running on PORT:☑️  ${PORT}`);
})