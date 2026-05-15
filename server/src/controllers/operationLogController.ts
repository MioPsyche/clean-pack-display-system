import type { Request, Response } from "express";

import { logService } from "../services/logService.js";
import { sendSuccess } from "../utils/response.js";

export const operationLogController = {
  list(_request: Request, response: Response): void {
    sendSuccess(response, logService.list());
  }
};
