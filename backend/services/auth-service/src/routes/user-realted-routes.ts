import { Router } from "express";
import { authMiddleware } from "../shared/middlewares/auth-middleware";
import { userDataController } from "../controllers/user-related-fetching";

const userRealtedRoutes = Router();

userRealtedRoutes.get("/user-data", authMiddleware, userDataController);

export default userRealtedRoutes;