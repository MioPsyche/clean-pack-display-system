import { Router } from "express";

import { bookingController } from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookingRoutes = Router();

bookingRoutes.get("/", authMiddleware, asyncHandler(bookingController.list));
bookingRoutes.post("/", asyncHandler(bookingController.create));
bookingRoutes.delete("/", authMiddleware, asyncHandler(bookingController.clear));
bookingRoutes.delete("/:id", authMiddleware, asyncHandler(bookingController.deleteById));
