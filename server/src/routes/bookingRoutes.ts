import { Router } from "express";

import { bookingController } from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const bookingRoutes = Router();

bookingRoutes.get("/", authMiddleware, bookingController.list);
bookingRoutes.post("/", bookingController.create);
bookingRoutes.delete("/", authMiddleware, bookingController.clear);
bookingRoutes.delete("/:id", authMiddleware, bookingController.deleteById);
