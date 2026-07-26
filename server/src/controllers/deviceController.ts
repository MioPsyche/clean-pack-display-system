import type { Request, Response } from "express";

import { deviceService } from "../services/deviceService.js";
import { sendSuccess } from "../utils/response.js";
import { asObject, parseId, readRequiredString } from "../utils/validators.js";

export const deviceController = {
  list(_request: Request, response: Response): void {
    sendSuccess(response, deviceService.list());
  },

  runAction(request: Request, response: Response): void {
    const body = asObject(request.body);
    const result = deviceService.runAction(
      parseId(request.params.id, "设备 id"),
      readRequiredString(body, "action", { label: "操作类型", maxLength: 50 }),
      request.user?.username
    );

    sendSuccess(response, result);
  }
};
