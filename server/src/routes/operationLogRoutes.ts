import { Router } from "express";

import { operationLogController } from "../controllers/operationLogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const operationLogRoutes = Router();

operationLogRoutes.get("/", authMiddleware, operationLogController.list);
