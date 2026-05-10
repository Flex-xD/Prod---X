import { Router } from "express";
import { createProductivityTimer } from "../controllers/timer-controller";

const productivityTimerRouter = Router();

productivityTimerRouter.post("/create" , createProductivityTimer);

export default productivityTimerRouter;