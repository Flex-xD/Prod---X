import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ApiError, authMiddleware, logger, sendError, sendResponse } from "./shared";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
// Use morgan and helmet lateron , first just build the basic structure


const services = {
    // Later on add the paths to the env file
    "/tasks": "http://localhost:3000",
    "/auth": "http://localhost:4000",
} as Record<string, string>;

app.all(/.*/, authMiddleware, async (req: Request, res: Response) => {
    const urlPath = req.path;
    logger.info(`Request received at API-GATEWAY for path: ${urlPath}`);
    const targetService = Object.keys(services).find(serviceKey => urlPath.startsWith(serviceKey));

    if (!targetService) {
        throw ApiError(StatusCodes.NOT_FOUND, `Service not found for the requested path : ${req.path}`);
    }

    const targetUrl = services[targetService];
    const forwardUrl = targetUrl + urlPath;
    const fullUrl = forwardUrl + (req.url.includes("?") ? req.url.split("?")[1] ? "?" + req.url.split("?")[1] : "" : "");

    try {
        logger.info(`Forwarding request to : ${fullUrl}`);
        const response = await axios({
            method: req.method,
            url: fullUrl,
            data:req.body ,
            headers: { ...req.headers },
            validateStatus: () => true
        })
        return sendResponse(res , {
            statusCode:response.status ,
            data:response.data , 
            message:"Request forwarded successfully" , 
            success:true
        })
    } catch (error) {
        sendError(res, { error });
    }
});

app.listen(PORT, async () => {
    logger.info(`API-GATEWAY ⛩️  is running on PORT:☑️  ${PORT}`);
})