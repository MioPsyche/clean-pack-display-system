export interface BookingInput {
  name: string;
  phone: string;
  organization?: string;
  email?: string;
  preferredTime?: string;
  message?: string;
  source?: string;
}

export interface BookingRow {
  id: number;
  name: string;
  phone: string;
  organization: string | null;
  email: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  name: string;
  phone: string;
  organization: string | null;
  email: string | null;
  preferredTime: string | null;
  message: string | null;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}
