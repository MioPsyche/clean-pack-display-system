import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import Database, { type Database as DatabaseConnection } from "better-sqlite3";

import { env } from "../config/env.js";
import { createSchema } from "./schema.js";
import { hashPassword } from "../utils/password.js";

const seedDeviceNames = [
  "演示设备 A - 清洗包装模拟线",
  "演示设备 B - 警示状态模拟台",
  "演示设备 C - 展示备用模拟机"
];

// V1.1 之前启动时会插入这台英文占位设备，seed 时一并清理，避免新旧清单混在一起。
const legacyDeviceNames = ["Leaf Cleaning Packaging Demo Device"];

const seedBookings = [
  {
    name: "演示联系人 A",
    phone: "demo-contact-001",
    organization: "演示学院",
    preferredTime: "2026-05-20",
    message: "希望了解样机结构和比赛展示流程。"
  },
  {
    name: "演示联系人 B",
    phone: "demo-contact-002",
    organization: "演示实验室",
    preferredTime: "2026-05-22",
    message: "关注叶菜清洗、输送和包装模块的联动演示。"
  },
  {
    name: "演示联系人 C",
    phone: "demo-contact-003",
    organization: "演示团队",
    preferredTime: "2026-05-25",
    message: "用于本地后台验收的预约演示记录。"
  }
];

const seedInquiries = [
  {
    name: "演示询价 A",
    phone: "demo-inquiry-001",
    organization: "演示合作社",
    quantity: "待沟通",
    scenario: "小型净菜处理演示",
    requirements: "关注设备模块组成、占地和后续改型方向。"
  },
  {
    name: "演示询价 B",
    phone: "demo-inquiry-002",
    organization: "演示单位",
    quantity: "待确认",
    scenario: "高校项目展示",
    requirements: "用于比赛展示的询价意向模拟数据。"
  },
  {
    name: "演示询价 C",
    phone: "demo-inquiry-003",
    organization: "演示基地",
    quantity: "待实测",
    scenario: "叶菜预处理流程验证",
    requirements: "技术参数未实测，后续以样机测试结果为准。"
  }
];

// 服务启动时兜底：设备表为空则插入与 seed 脚本一致的演示设备，
// 避免“先启动后 seed”与“先 seed 后启动”得到不同的设备清单。
export const seedDefaultDevices = (db: DatabaseConnection): void => {
  const deviceCount = db.prepare("SELECT COUNT(*) AS count FROM devices").get() as { count: number };

  if (deviceCount.count > 0) {
    return;
  }

  const insertDevice = db.prepare("INSERT INTO devices (name, run_status, warning_status) VALUES (?, ?, ?)");

  seedDeviceNames.forEach((name) => {
    insertDevice.run(name, "stopped", 0);
  });
};

export const seedDemoData = async (db: DatabaseConnection): Promise<void> => {
  const adminPasswordHash = await hashPassword("admin123456");

  const seedTransaction = db.transaction(() => {
    const existingAdmin = db.prepare("SELECT id FROM users WHERE username = ?").get("admin") as
      | { id: number }
      | undefined;

    if (existingAdmin) {
      db.prepare(
        `
        UPDATE users
        SET password_hash = ?, role = 'admin', updated_at = CURRENT_TIMESTAMP
        WHERE username = 'admin'
      `
      ).run(adminPasswordHash);
    } else {
      db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')").run(
        "admin",
        adminPasswordHash
      );
    }

    const managedDeviceNames = [...seedDeviceNames, ...legacyDeviceNames];
    const managedDevicePlaceholders = managedDeviceNames.map(() => "?").join(", ");

    // 先删除挂在演示设备上的运行期日志，避免设备被删后留下 device_id 为 NULL 的孤儿日志。
    db.prepare(
      `DELETE FROM operation_logs WHERE device_id IN (SELECT id FROM devices WHERE name IN (${managedDevicePlaceholders}))`
    ).run(...managedDeviceNames);
    db.prepare("DELETE FROM operation_logs WHERE detail LIKE '[seed]%'").run();
    // 清理历史遗留的孤儿日志（设备已删除、device_id 为 NULL 的记录）。
    db.prepare("DELETE FROM operation_logs WHERE device_id IS NULL").run();
    db.prepare(`DELETE FROM devices WHERE name IN (${managedDevicePlaceholders})`).run(...managedDeviceNames);
    db.prepare("DELETE FROM demo_bookings WHERE source = 'seed'").run();
    db.prepare("DELETE FROM inquiries WHERE source = 'seed'").run();

    const insertBooking = db.prepare(
      `
      INSERT INTO demo_bookings
        (name, phone, organization, preferred_time, message, source)
      VALUES
        (?, ?, ?, ?, ?, 'seed')
    `
    );

    seedBookings.forEach((booking) => {
      insertBooking.run(
        booking.name,
        booking.phone,
        booking.organization,
        booking.preferredTime,
        booking.message
      );
    });

    const insertInquiry = db.prepare(
      `
      INSERT INTO inquiries
        (name, phone, organization, quantity, scenario, requirements, source)
      VALUES
        (?, ?, ?, ?, ?, ?, 'seed')
    `
    );

    seedInquiries.forEach((inquiry) => {
      insertInquiry.run(
        inquiry.name,
        inquiry.phone,
        inquiry.organization,
        inquiry.quantity,
        inquiry.scenario,
        inquiry.requirements
      );
    });

    const insertDevice = db.prepare(
      `
      INSERT INTO devices
        (name, run_status, warning_status, last_action)
      VALUES
        (?, ?, ?, ?)
    `
    );

    const insertedDeviceIds = seedDeviceNames.map((name, index) => {
      const result = insertDevice.run(
        name,
        index === 0 ? "running" : "stopped",
        index === 1 ? 1 : 0,
        index === 0 ? "start" : index === 1 ? "warning_on" : null
      );

      return Number(result.lastInsertRowid);
    });

    const insertLog = db.prepare("INSERT INTO operation_logs (device_id, action, detail) VALUES (?, ?, ?)");
    insertLog.run(insertedDeviceIds[0], "start", "[seed] 演示设备 A 已模拟启动。");
    insertLog.run(insertedDeviceIds[1], "warning_on", "[seed] 演示设备 B 已模拟开启警示。");
    insertLog.run(insertedDeviceIds[2], "stop", "[seed] 演示设备 C 保持停止状态。");
  });

  seedTransaction();
};

const runSeedScript = async (): Promise<void> => {
  fs.mkdirSync(path.dirname(env.databasePath), { recursive: true });

  const db = new Database(env.databasePath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  createSchema(db);

  await seedDemoData(db);
  db.close();

  console.log("Demo seed data has been initialized.");
  console.log("Default local demo admin (仅限本地演示): username=admin password=admin123456");
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSeedScript().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
