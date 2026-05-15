import type { DemoBookingRecord } from '../types/booking';
import { apiRequest } from './client';

type ApiBooking = {
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
};

export type BookingPayload = {
  name: string;
  phone: string;
  organization?: string;
  preferredDate?: string;
  message?: string;
};

function toDemoBookingRecord(booking: ApiBooking): DemoBookingRecord {
  return {
    id: `api-demo-${booking.id}`,
    name: booking.name,
    phone: booking.phone,
    organization: booking.organization ?? undefined,
    preferredDate: booking.preferredTime ?? undefined,
    message: booking.message ?? undefined,
    createdAt: booking.createdAt,
  };
}

export async function fetchBookings() {
  const records = await apiRequest<ApiBooking[]>('/api/bookings', { auth: true });
  return records.map(toDemoBookingRecord);
}

export async function createBooking(payload: BookingPayload) {
  const record = await apiRequest<ApiBooking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      organization: payload.organization,
      preferredTime: payload.preferredDate,
      message: payload.message,
    }),
  });

  return toDemoBookingRecord(record);
}

export function clearBookings() {
  return apiRequest<{ deleted: number }>('/api/bookings', {
    method: 'DELETE',
    auth: true,
  });
}
