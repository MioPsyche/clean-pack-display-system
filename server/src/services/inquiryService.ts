import { inquiryRepository } from "../repositories/inquiryRepository.js";
import type { Inquiry, InquiryInput, InquiryRow } from "../types/inquiry.js";
import { HttpError } from "../utils/httpError.js";
import { toIsoTimestamp } from "../utils/timestamp.js";

const toInquiry = (row: InquiryRow): Inquiry => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  organization: row.organization,
  email: row.email,
  quantity: row.quantity,
  scenario: row.scenario,
  requirements: row.requirements,
  status: row.status,
  source: row.source,
  createdAt: toIsoTimestamp(row.created_at),
  updatedAt: toIsoTimestamp(row.updated_at)
});

export const inquiryService = {
  list(): Inquiry[] {
    return inquiryRepository.list().map(toInquiry);
  },

  create(input: InquiryInput): Inquiry {
    return toInquiry(inquiryRepository.create(input));
  },

  clear(): { deleted: number } {
    return {
      deleted: inquiryRepository.clear()
    };
  },

  deleteById(id: number): { deleted: number } {
    const deleted = inquiryRepository.deleteById(id);

    if (deleted === 0) {
      throw new HttpError(404, "询价记录不存在。");
    }

    return { deleted };
  }
};
