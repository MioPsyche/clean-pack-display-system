import type { Request, Response } from "express";

import { bookingService } from "../services/bookingService.js";
import { sendSuccess } from "../utils/response.js";
import { asObject, parseId, readOptionalEmail, readOptionalString, readRequiredString } from "../utils/validators.js";

export const bookingController = {
  list(_request: Request, response: Response): void {
    sendSuccess(response, bookingService.list());
  },

  create(request: Request, response: Response): void {
    const body = asObject(request.body);
    const booking = bookingService.create({
      name: readRequiredString(body, "name", { label: "姓名", maxLength: 100 }),
      phone: readRequiredString(body, "phone", { label: "联系电话", maxLength: 50 }),
      organization: readOptionalString(body, "organization", { label: "单位名称", maxLength: 200 }),
      email: readOptionalEmail(body, "email", { label: "邮箱", maxLength: 200 }),
      preferredTime: readOptionalString(body, "preferredTime", { label: "期望演示时间", maxLength: 100 }),
      message: readOptionalString(body, "message", { label: "留言", maxLength: 2000 })
    });

    sendSuccess(response, booking, 201);
  },

  clear(_request: Request, response: Response): void {
    sendSuccess(response, bookingService.clear());
  },

  deleteById(request: Request, response: Response): void {
    sendSuccess(response, bookingService.deleteById(parseId(request.params.id, "预约记录 id")));
  }
};
