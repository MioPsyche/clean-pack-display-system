import { Router } from "express";

import { authController } from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.post("/register", (request, response, next) => {
  authController.register(request, response).catch(next);
});

authRoutes.post("/login", (request, response, next) => {
  authController.login(request, response).catch(next);
});
