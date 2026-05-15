import { db } from "../config/database.js";
import type { BookingInput, BookingRow } from "../types/booking.js";

export const bookingRepository = {
  list(): BookingRow[] {
    return db.prepare("SELECT * FROM demo_bookings ORDER BY created_at DESC, id DESC").all() as BookingRow[];
  },

  create(input: BookingInput): BookingRow {
    const result = db
      .prepare(
        `
        INSERT INTO demo_bookings
          (name, phone, organization, email, preferred_time, message, source)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        input.name,
        input.phone,
        input.organization ?? null,
        input.email ?? null,
        input.preferredTime ?? null,
        input.message ?? null,
        input.source ?? "api"
      );

    return db.prepare("SELECT * FROM demo_bookings WHERE id = ?").get(Number(result.lastInsertRowid)) as BookingRow;
  },

  clear(): number {
    const result = db.prepare("DELETE FROM demo_bookings").run();
    return result.changes;
  },

  deleteById(id: number): number {
    const result = db.prepare("DELETE FROM demo_bookings WHERE id = ?").run(id);
    return result.changes;
  }
};
