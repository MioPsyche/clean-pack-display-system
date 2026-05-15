import { db } from "../config/database.js";
import type { InquiryInput, InquiryRow } from "../types/inquiry.js";

export const inquiryRepository = {
  list(): InquiryRow[] {
    return db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC, id DESC").all() as InquiryRow[];
  },

  create(input: InquiryInput): InquiryRow {
    const result = db
      .prepare(
        `
        INSERT INTO inquiries
          (name, phone, organization, email, quantity, scenario, requirements, source)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        input.name,
        input.phone,
        input.organization ?? null,
        input.email ?? null,
        input.quantity ?? null,
        input.scenario ?? null,
        input.requirements ?? null,
        input.source ?? "api"
      );

    return db.prepare("SELECT * FROM inquiries WHERE id = ?").get(Number(result.lastInsertRowid)) as InquiryRow;
  },

  clear(): number {
    const result = db.prepare("DELETE FROM inquiries").run();
    return result.changes;
  },

  deleteById(id: number): number {
    const result = db.prepare("DELETE FROM inquiries WHERE id = ?").run(id);
    return result.changes;
  }
};
