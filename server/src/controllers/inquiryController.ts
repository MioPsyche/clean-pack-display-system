import type { Request, Response } from "express";

import { inquiryService } from "../services/inquiryService.js";
import { sendSuccess } from "../utils/response.js";
import { asObject, parseId, readOptionalString, readRequiredString } from "../utils/validators.js";

export const inquiryController = {
  list(_request: Request, response: Response): void {
    sendSuccess(response, inquiryService.list());
  },

  create(request: Request, response: Response): void {
    const body = asObject(request.body);
    const inquiry = inquiryService.create({
      name: readRequiredString(body, "name"),
      phone: readRequiredString(body, "phone"),
      organization: readOptionalString(body, "organization"),
      email: readOptionalString(body, "email"),
      quantity: readOptionalString(body, "quantity"),
      scenario: readOptionalString(body, "scenario"),
      requirements: readOptionalString(body, "requirements"),
      source: readOptionalString(body, "source")
    });

    sendSuccess(response, inquiry, 201);
  },

  clear(_request: Request, response: Response): void {
    sendSuccess(response, inquiryService.clear());
  },

  deleteById(request: Request, response: Response): void {
    sendSuccess(response, inquiryService.deleteById(parseId(request.params.id)));
  }
};
