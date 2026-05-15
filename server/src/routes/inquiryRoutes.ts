import { Router } from "express";

import { inquiryController } from "../controllers/inquiryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const inquiryRoutes = Router();

inquiryRoutes.get("/", authMiddleware, inquiryController.list);
inquiryRoutes.post("/", inquiryController.create);
inquiryRoutes.delete("/", authMiddleware, inquiryController.clear);
inquiryRoutes.delete("/:id", authMiddleware, inquiryController.deleteById);
