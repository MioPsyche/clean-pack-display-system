export interface InquiryInput {
  name: string;
  phone: string;
  organization?: string;
  email?: string;
  quantity?: string;
  scenario?: string;
  requirements?: string;
  source?: string;
}

export interface InquiryRow {
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
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
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
}
