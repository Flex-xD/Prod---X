import { asyncHandler } from "@shared/utils/async-handler";
import {Request ,Response}  from "express";

export const registerController = asyncHandler(async (req:Request , res:Response) => {
    const {email , password , username} = req.body;
    
})