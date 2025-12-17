import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ApiError, authMiddleware, logger, sendError, sendResponse } from "./shared";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import connectDb from "./shared/config/db";
import axios from "axios";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
    origin:"http://localhost:5173" ,
    credentials:true ,
    methods:["GET" , "POST" , "PUT" , "DELETE" , "PATCH"]
}));
app.use(express.json());
// Use morgan and helmet lateron , first just build the basic structure


const services = {
    // Later on add the paths to the env file
    "/tasks": "http://localhost:3000/api/v1",
    "/auth": "http://localhost:5000/api/v1",
} as Record<string, string>;

app.all(/.*/, async (req: Request, res: Response) => {
    const urlPath = req.path;
    logger.info(`Request received ✅ at API-GATEWAY for path: ${urlPath}`);
    const targetService = Object.keys(services).find(serviceKey => urlPath.startsWith(serviceKey));

    if (!targetService) {
        throw ApiError(StatusCodes.NOT_FOUND, `Service not found ❌ for the requested path : ${req.path}`);
    }

    const targetUrl = services[targetService];
    const forwardUrl = targetUrl + urlPath;
    const fullUrl = forwardUrl + (req.url.includes("?") ? req.url.split("?")[1] ? "?" + req.url.split("?")[1] : "" : "");

    try {
        logger.info(`Forwarding request to ⏩ : ${fullUrl}`);
        const response = await axios({
            method: req.method,
            url: fullUrl,
            data:req.body ,
            headers: { ...req.headers },
            validateStatus: () => true
        })
        return sendResponse(res , {
            statusCode:response.data.statusCode , 
            success:response.data.success , 
            message:response.data.message , 
            data:response.data.data
        })
    } catch (error) {
        sendError(res, { error });
    }
});

app.listen(PORT, async () => {
    await connectDb(MONGODB_URI || "");
    logger.info(`API-GATEWAY ⛩️  is running on PORT:☑️  ${PORT}`);
})