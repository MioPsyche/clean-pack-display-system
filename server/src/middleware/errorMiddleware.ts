import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError.js";
import { sendError } from "../utils/response.js";

export const notFoundMiddleware = (request: Request, response: Response): void => {
  sendError(response, 404, `接口不存在：${request.method} ${request.originalUrl}`);
};

const readErrorStatus = (error: unknown): number | undefined => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === "number" && status >= 400 && status < 600) {
      return status;
    }
  }

  return undefined;
};

export const errorMiddleware = (
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    sendError(response, error.statusCode, error.message);
    return;
  }

  // body-parser 抛出的错误自带 status（JSON 语法错误 400、超出 limit 413 等），
  // 不应被当成服务端 500。
  const bodyParserStatus = readErrorStatus(error);
  if (bodyParserStatus !== undefined && bodyParserStatus < 500) {
    if (error instanceof SyntaxError) {
      sendError(response, 400, "请求体不是合法的 JSON。");
      return;
    }

    if (bodyParserStatus === 413) {
      sendError(response, 413, "请求体过大。");
      return;
    }

    sendError(response, bodyParserStatus, "请求格式不正确。");
    return;
  }

  console.error(error);

  sendError(response, 500, "服务器内部错误，请稍后重试。");
};
