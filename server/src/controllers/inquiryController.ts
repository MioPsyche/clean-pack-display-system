import type { Request, Response } from "express";

import { inquiryService } from "../services/inquiryService.js";
import { sendSuccess } from "../utils/response.js";
import { asObject, parseId, readOptionalEmail, readOptionalString, readRequiredString } from "../utils/validators.js";

export const inquiryController = {
  list(_request: Request, response: Response): void {
    sendSuccess(response, inquiryService.list());
  },

  create(request: Request, response: Response): void {
    const body = asObject(request.body);
    const inquiry = inquiryService.create({
      name: readRequiredString(body, "name", { label: "姓名", maxLength: 100 }),
      phone: readRequiredString(body, "phone", { label: "联系电话", maxLength: 50 }),
      organization: readOptionalString(body, "organization", { label: "单位名称", maxLength: 200 }),
      email: readOptionalEmail(body, "email", { label: "邮箱", maxLength: 200 }),
      // 前端将“预算范围”提交到 quantity 字段（见 src/api/inquiries.ts 的字段映射）
      quantity: readOptionalString(body, "quantity", { label: "数量/预算", maxLength: 100 }),
      scenario: readOptionalString(body, "scenario", { label: "应用场景", maxLength: 200 }),
      requirements: readOptionalString(body, "requirements", { label: "需求说明", maxLength: 2000 })
    });

    sendSuccess(response, inquiry, 201);
  },

  clear(_request: Request, response: Response): void {
    sendSuccess(response, inquiryService.clear());
  },

  deleteById(request: Request, response: Response): void {
    sendSuccess(response, inquiryService.deleteById(parseId(request.params.id, "询价记录 id")));
  }
};
