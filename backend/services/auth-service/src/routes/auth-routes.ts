import { Router } from "express";
import { googleAuthController, loginController, registerController } from "../controllers/auth-controller";
import { validate } from "../shared/middlewares/zod-middleware";
import { loginSchema, registerSchema } from "../shared/schemas/user-schema";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerController);
authRoutes.post("/login", validate(loginSchema), loginController);
authRoutes.post("/google-auth", googleAuthController);

export default authRoutes;