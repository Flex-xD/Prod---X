import {Router} from "express";
import { googleAuthController, loginController, registerController } from "../controllers/auth-controller";
import { loginSchema, registerSchema } from "@shared/src/schemas/user-schema";
import { validate } from "@shared/src/middlewares/zod-middleware";

const authRoutes = Router();

authRoutes.post("/register" , validate(registerSchema) ,  registerController);
authRoutes.post("/login" , validate(loginSchema) ,  loginController);
authRoutes.post("/google-auth" , googleAuthController);

export default authRoutes;