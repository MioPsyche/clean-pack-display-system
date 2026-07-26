import type { Request, RequestHandler, Response } from "express";

type RouteHandler = (request: Request, response: Response) => void | Promise<void>;

export const asyncHandler = (handler: RouteHandler): RequestHandler => {
  return (request, response, next) => {
    try {
      Promise.resolve(handler(request, response)).catch(next);
    } catch (error) {
      next(error);
    }
  };
};
