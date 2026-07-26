import app from "./app.js";
import { env } from "./config/env.js";
import { db, initializeDatabase } from "./config/database.js";

initializeDatabase();

const server = app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[server] 端口 ${env.port} 已被占用，请关闭占用进程或通过 PORT 环境变量更换端口。`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

let isShuttingDown = false;

const shutdown = (signal: string): void => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`[server] 收到 ${signal}，正在关闭服务...`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled rejection:", reason);
});
