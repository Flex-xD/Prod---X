import { sendError } from "@shared/utils/response-utils";
import { NextFunction, Response, Request } from "express";

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            parmas: req.params,
        })
        next();
    } catch (error) {
        return sendError(res, { error });
    }
}