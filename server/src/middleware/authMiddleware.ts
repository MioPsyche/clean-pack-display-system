import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError.js";
import { verifyAuthToken } from "../utils/jwt.js";

export const authMiddleware = (request: Request, _response: Response, next: NextFunction): void => {
  const header = request.header("Authorization");

  if (!header?.startsWith("Bearer ")) {
    next(new HttpError(401, "缺少登录凭证，请先登录。"));
    return;
  }

  try {
    request.user = verifyAuthToken(header.slice("Bearer ".length));
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "登录已过期或凭证无效，请重新登录。"));
  }
};
