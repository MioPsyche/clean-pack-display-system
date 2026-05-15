import type { NextFunction, Request, Response } from "express";

import { verifyAuthToken } from "../utils/jwt.js";

export const authMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  const header = request.header("Authorization");

  if (!header?.startsWith("Bearer ")) {
    response.status(401).json({
      success: false,
      message: "Authorization token is required."
    });
    return;
  }

  try {
    request.user = verifyAuthToken(header.slice("Bearer ".length));
    next();
  } catch {
    response.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};
