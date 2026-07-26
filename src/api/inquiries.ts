import type { InquiryRecord } from '../types/inquiry';
import { apiRequest } from './client';

type ApiInquiry = {
  id: number;
  name: string;
  phone: string;
  organization: string | null;
  email: string | null;
  quantity: string | null;
  scenario: string | null;
  requirements: string | null;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type InquiryPayload = {
  name: string;
  phone: string;
  organization?: string;
  expectedScenario?: string;
  budgetRange?: string;
  message?: string;
};

function toInquiryRecord(inquiry: ApiInquiry): InquiryRecord {
  return {
    id: `api-inq-${inquiry.id}`,
    backendId: inquiry.id,
    name: inquiry.name,
    phone: inquiry.phone,
    organization: inquiry.organization ?? undefined,
    expectedScenario: inquiry.scenario ?? undefined,
    budgetRange: inquiry.quantity ?? undefined,
    message: inquiry.requirements ?? undefined,
    createdAt: inquiry.createdAt,
  };
}

export async function fetchInquiries() {
  const records = await apiRequest<ApiInquiry[]>('/api/inquiries', { auth: true });
  return records.map(toInquiryRecord);
}

export async function createInquiry(payload: InquiryPayload) {
  const record = await apiRequest<ApiInquiry>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      organization: payload.organization,
      quantity: payload.budgetRange,
      scenario: payload.expectedScenario,
      requirements: payload.message,
    }),
  });

  return toInquiryRecord(record);
}

export function clearInquiries() {
  return apiRequest<{ deleted: number }>('/api/inquiries', {
    method: 'DELETE',
    auth: true,
  });
}

export function deleteInquiry(id: number) {
  return apiRequest<{ deleted: number }>(`/api/inquiries/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
