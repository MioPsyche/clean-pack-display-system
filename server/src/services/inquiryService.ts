import { inquiryRepository } from "../repositories/inquiryRepository.js";
import type { Inquiry, InquiryInput, InquiryRow } from "../types/inquiry.js";

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
  createdAt: row.created_at,
  updatedAt: row.updated_at
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
    return {
      deleted: inquiryRepository.deleteById(id)
    };
  }
};
