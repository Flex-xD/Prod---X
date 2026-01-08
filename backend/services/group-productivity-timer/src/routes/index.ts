import {Router} from "express";
import { createGroupProductivityTimer } from "../controllers";
const groupTimerRouter = Router();

groupTimerRouter.post("/create-group-timer" , createGroupProductivityTimer);

export default groupTimerRouter;