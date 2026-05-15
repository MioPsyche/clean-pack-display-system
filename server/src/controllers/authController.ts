import type { Request, Response } from "express";

import { authService } from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";
import { asObject, readRequiredString } from "../utils/validators.js";

export const authController = {
  async register(request: Request, response: Response): Promise<void> {
    const body = asObject(request.body);
    const result = await authService.register(
      readRequiredString(body, "username"),
      readRequiredString(body, "password")
    );

    sendSuccess(response, result, 201);
  },

  async login(request: Request, response: Response): Promise<void> {
    const body = asObject(request.body);
    const result = await authService.login(readRequiredString(body, "username"), readRequiredString(body, "password"));

    sendSuccess(response, result);
  }
};
