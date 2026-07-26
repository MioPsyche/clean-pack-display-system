import { Router } from "express";

import { deviceController } from "../controllers/deviceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const deviceRoutes = Router();

deviceRoutes.get("/", asyncHandler(deviceController.list));
deviceRoutes.post("/:id/action", authMiddleware, asyncHandler(deviceController.runAction));
