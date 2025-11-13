import {Router} from "express";
import { registerController } from "../controllers/auth-controller";
import { validate } from "../middleware/zod-middleware";
import { registerSchema } from "../schemas/user-schema";

const authRoutes = Router();

authRoutes.post("/register" , validate(registerSchema) ,  registerController);

export default authRoutes;