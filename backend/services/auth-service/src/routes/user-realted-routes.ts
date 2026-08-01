import { Router } from "express";
import { getUsersForGroupProductivityTimer, userDataController } from "../controllers/user-related-fetching";

const userRelatedRoutes = Router();

userRelatedRoutes.get("/user-data", userDataController);
userRelatedRoutes.get("/users-to-invite" , getUsersForGroupProductivityTimer);

export default userRelatedRoutes;