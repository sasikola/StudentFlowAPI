import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import { ENV } from "./config/env";
import { notFound, globalErrorHandler } from "./middleware/errorMiddleware";

// Routes
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import paymentRoutes from "./routes/paymentRoutes";

// Connect DB
connectDB();

const app = express();

// ── Middleware ──
app.use(helmet());
app.use(cors());
app.use(morgan(ENV.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    app: "StudentFlow API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);

// ── Error handlers ──
app.use(notFound);
app.use(globalErrorHandler);

// ── Start server ──
app.listen(ENV.PORT, () => {
  console.log(`🚀 StudentFlow API running on port ${ENV.PORT}`);
  console.log(`📡 Environment: ${ENV.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${ENV.PORT}/health`);
});

export default app;
