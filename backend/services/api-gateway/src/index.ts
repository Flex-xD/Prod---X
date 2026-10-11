import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ApiError, authMiddleware, logger, sendError } from "./shared";
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

interface IAuthRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.is("multipart/form-data")) {
        return next();
    }
    return express.json()(req, res, next);
});


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


// ? Add these to env
const services = {
    "/task": "http://localhost:4000/api/v1",
    "/user": "http://localhost:5000/api/v1",
    "/auth": "http://localhost:5000/api/v1",
    "/profile": "http://localhost:5000/api/v1", 
    "/group-productivity-timer": "http://localhost:9000/api/v1",
    "/productivity-timer": "http://localhost:6000/api/v1",
    "/notification": "http://localhost:10000/api/v1",
    "/dashboard": "http://localhost:7000/api/v1",
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

    const isMultipart = req.is("multipart/form-data");

    try {
        const response = await axios({
            method: req.method,
            url: forwardUrl,
            data: isMultipart ? req : req.body,
            params: req.query,
            headers: {
                authorization: req.headers.authorization,
                "x-user-id": userId?.toString(),
                "x-service-key": req.headers["x-service-key"],
                cookie: req.headers.cookie,
                ...(isMultipart ? { "content-type": req.headers["content-type"] } : {}),
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true
        });

        const setCookieHeader = response.headers["set-cookie"];
        if (setCookieHeader) {
            res.append("Set-Cookie", setCookieHeader);
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