import { Router } from "express";

import { inquiryController } from "../controllers/inquiryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const inquiryRoutes = Router();

inquiryRoutes.get("/", authMiddleware, asyncHandler(inquiryController.list));
inquiryRoutes.post("/", asyncHandler(inquiryController.create));
inquiryRoutes.delete("/", authMiddleware, asyncHandler(inquiryController.clear));
inquiryRoutes.delete("/:id", authMiddleware, asyncHandler(inquiryController.deleteById));
