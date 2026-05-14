export type InquiryRecord = {
  id: string;
  name: string;
  phone: string;
  organization?: string;
  expectedScenario?: string;
  budgetRange?: string;
  message?: string;
  createdAt: string;
};
