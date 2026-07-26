import cors from "cors";
import express from "express";

import { authRoutes } from "./routes/authRoutes.js";
import { bookingRoutes } from "./routes/bookingRoutes.js";
import { deviceRoutes } from "./routes/deviceRoutes.js";
import { inquiryRoutes } from "./routes/inquiryRoutes.js";
import { operationLogRoutes } from "./routes/operationLogRoutes.js";
import { env } from "./config/env.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware.js";
import { sendSuccess } from "./utils/response.js";

const app = express();

// 前端使用 Bearer token 而非 Cookie，无需 credentials
app.use(
  cors({
    origin: env.corsOrigin
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  sendSuccess(response, {
    status: "ok",
    service: "clean-pack-display-server"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/operation-logs", operationLogRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
