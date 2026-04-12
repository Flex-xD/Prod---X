import { Router } from "express";
import { userDataController } from "../controllers/user-related-fetching";

const userRealtedRoutes = Router();

userRealtedRoutes.get("/user-data", userDataController);

export default userRealtedRoutes;