import { bookingRepository } from "../repositories/bookingRepository.js";
import type { Booking, BookingInput, BookingRow } from "../types/booking.js";
import { HttpError } from "../utils/httpError.js";
import { toIsoTimestamp } from "../utils/timestamp.js";

const toBooking = (row: BookingRow): Booking => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  organization: row.organization,
  email: row.email,
  preferredTime: row.preferred_time,
  message: row.message,
  status: row.status,
  source: row.source,
  createdAt: toIsoTimestamp(row.created_at),
  updatedAt: toIsoTimestamp(row.updated_at)
});

export const bookingService = {
  list(): Booking[] {
    return bookingRepository.list().map(toBooking);
  },

  create(input: BookingInput): Booking {
    return toBooking(bookingRepository.create(input));
  },

  clear(): { deleted: number } {
    return {
      deleted: bookingRepository.clear()
    };
  },

  deleteById(id: number): { deleted: number } {
    const deleted = bookingRepository.deleteById(id);

    if (deleted === 0) {
      throw new HttpError(404, "预约记录不存在。");
    }

    return { deleted };
  }
};
