import fs from "node:fs";
import path from "node:path";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// 必须在导入应用代码之前设置：config/env.ts 在模块加载时读取环境变量
const TEST_DB = "./data/test-app.sqlite";
process.env.DATABASE_PATH = TEST_DB;

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

type ExpressApp = import("express").Express;
type SqliteDatabase = import("better-sqlite3").Database;

let app: ExpressApp;
let db: SqliteDatabase;
let token = "";

const removeTestDb = (): void => {
  for (const suffix of ["", "-wal", "-shm"]) {
    fs.rmSync(path.resolve(`${TEST_DB}${suffix}`), { force: true });
  }
};

beforeAll(async () => {
  removeTestDb();

  const database = await import("../src/config/database");
  database.initializeDatabase();
  db = database.db;
  app = (await import("../src/app")).default;

  const response = await request(app)
    .post("/api/auth/register")
    .send({ username: "tester", password: "test123456" });

  expect(response.status).toBe(201);
  token = response.body.data.token as string;
});

afterAll(() => {
  db.close();
  removeTestDb();
});

describe("基础接口", () => {
  it("健康检查返回统一 envelope", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, data: { status: "ok" } });
  });

  it("未知路由返回统一 404 格式", async () => {
    const response = await request(app).get("/api/not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("非法 JSON 返回 400 而不是 500", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Content-Type", "application/json")
      .send("{broken json");

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("JSON");
  });
});

describe("认证", () => {
  it("用户名过短返回中文校验提示", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "ab", password: "test123456" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("用户名");
  });

  it("重复注册返回 409", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "tester", password: "another123" });

    expect(response.status).toBe(409);
  });

  it("密码错误返回 401 且不区分账号是否存在", async () => {
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ username: "tester", password: "wrong-password" });
    const missingUser = await request(app)
      .post("/api/auth/login")
      .send({ username: "no-such-user", password: "whatever123" });

    expect(wrongPassword.status).toBe(401);
    expect(missingUser.status).toBe(401);
    expect(wrongPassword.body.message).toBe(missingUser.body.message);
  });

  it("未携带 token 访问受保护接口返回 401", async () => {
    const response = await request(app).get("/api/bookings");

    expect(response.status).toBe(401);
  });
});

describe("预约演示记录", () => {
  let createdId = 0;

  it("创建记录：source 由服务端固定，时间戳为 ISO-8601", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ name: "测试联系人", phone: "13800000000", source: "seed" });

    expect(response.status).toBe(201);
    expect(response.body.data.source).toBe("api");
    expect(response.body.data.createdAt).toMatch(ISO_PATTERN);
    createdId = response.body.data.id as number;
  });

  it("缺少必填字段返回 400", async () => {
    const response = await request(app).post("/api/bookings").send({ phone: "13800000000" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("姓名");
  });

  it("邮箱格式非法返回 400", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ name: "测试联系人", phone: "13800000000", email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("邮箱");
  });

  it("登录后可查询到刚创建的记录", async () => {
    const response = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    const ids = (response.body.data as Array<{ id: number }>).map((item) => item.id);
    expect(ids).toContain(createdId);
  });

  it("按 id 删除记录，重复删除返回 404", async () => {
    const deleted = await request(app)
      .delete(`/api/bookings/${createdId}`)
      .set("Authorization", `Bearer ${token}`);
    const again = await request(app)
      .delete(`/api/bookings/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleted.status).toBe(200);
    expect(deleted.body.data.deleted).toBe(1);
    expect(again.status).toBe(404);
  });

  it("非法 id 返回 400", async () => {
    const response = await request(app)
      .delete("/api/bookings/1e3")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("模拟设备与操作日志", () => {
  it("启动时自动生成与 seed 一致的演示设备", async () => {
    const response = await request(app).get("/api/devices");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(3);
  });

  it("执行模拟操作后状态更新，日志记录操作人", async () => {
    const devices = await request(app).get("/api/devices");
    const deviceId = devices.body.data[0].id as number;

    const action = await request(app)
      .post(`/api/devices/${deviceId}/action`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "warning_on" });

    expect(action.status).toBe(200);
    expect(action.body.data.device.warningStatus).toBe(true);

    const logs = await request(app)
      .get("/api/operation-logs")
      .set("Authorization", `Bearer ${token}`);

    expect(logs.status).toBe(200);
    expect(logs.body.data[0].detail).toContain("操作人：tester");
  });

  it("不支持的操作返回 400", async () => {
    const devices = await request(app).get("/api/devices");
    const deviceId = devices.body.data[0].id as number;

    const response = await request(app)
      .post(`/api/devices/${deviceId}/action`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "explode" });

    expect(response.status).toBe(400);
  });
});
