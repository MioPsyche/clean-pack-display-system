import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError.js";

export const notFoundMiddleware = (request: Request, response: Response): void => {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`
  });
};

export const errorMiddleware = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    success: false,
    message: "Internal server error."
  });
};
