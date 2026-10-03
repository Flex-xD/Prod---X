import { Router } from "express";
import { getProfileData, updateUsername, updateAvatar } from "../controllers/profile-controller";
import { uploadAvatar } from "../shared/middlewares/multer-middleware";

const profileRouter = Router();

profileRouter.get("/", getProfileData);
profileRouter.patch("/username", updateUsername);
profileRouter.post("/avatar", uploadAvatar, updateAvatar);

export default profileRouter;