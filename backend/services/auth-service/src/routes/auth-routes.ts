import { Router } from "express";
import { googleAuthController, loginController, registerController } from "../controllers/auth-controller";
import { validate } from "../shared/middlewares/zod-middleware";
import { loginSchema, registerSchema } from "../shared/schemas/user-schema";
import { refresh } from "../controllers/refresh-token-controller";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerController);
authRoutes.post("/login", validate(loginSchema), loginController);
authRoutes.post("/google-auth", googleAuthController);
authRoutes.post("/refresh" , refresh);

export default authRoutes;