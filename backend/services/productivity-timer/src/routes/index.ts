import { Router } from "express";
import { createProductivityTimer } from "../controllers/timer-controller";

const productivityTimerRouter = Router();

productivityTimerRouter.post("/create-timer" , createProductivityTimer);

export default productivityTimerRouter;