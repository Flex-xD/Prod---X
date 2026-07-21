import { Router } from "express";
import { getUsersForGroupProductivityTimer, inviteUsersToGroupTimer, userDataController } from "../controllers/user-related-fetching";

const userRelatedRoutes = Router();

userRelatedRoutes.get("/user-data", userDataController);
userRelatedRoutes.get("/users-to-invite" , getUsersForGroupProductivityTimer);
userRelatedRoutes.post("/invite-user/:userToInviteId" , inviteUsersToGroupTimer );

export default userRelatedRoutes;