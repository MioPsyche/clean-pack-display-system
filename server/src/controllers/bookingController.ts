import type { Request, Response } from "express";

import { bookingService } from "../services/bookingService.js";
import { sendSuccess } from "../utils/response.js";
import {
  asObject,
  parseId,
  readOptionalString,
  readOptionalStringFrom,
  readRequiredString
} from "../utils/validators.js";

export const bookingController = {
  list(_request: Request, response: Response): void {
    sendSuccess(response, bookingService.list());
  },

  create(request: Request, response: Response): void {
    const body = asObject(request.body);
    const booking = bookingService.create({
      name: readRequiredString(body, "name"),
      phone: readRequiredString(body, "phone"),
      organization: readOptionalString(body, "organization"),
      email: readOptionalString(body, "email"),
      preferredTime: readOptionalStringFrom(body, ["preferredTime", "preferred_time"]),
      message: readOptionalString(body, "message"),
      source: readOptionalString(body, "source")
    });

    sendSuccess(response, booking, 201);
  },

  clear(_request: Request, response: Response): void {
    sendSuccess(response, bookingService.clear());
  },

  deleteById(request: Request, response: Response): void {
    sendSuccess(response, bookingService.deleteById(parseId(request.params.id)));
  }
};
