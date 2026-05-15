import { Router } from "express";

import { deviceController } from "../controllers/deviceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const deviceRoutes = Router();

deviceRoutes.get("/", deviceController.list);
deviceRoutes.post("/:id/action", authMiddleware, deviceController.runAction);
