require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { ENV } = require("./config/env");
const {
  notFound,
  globalErrorHandler,
} = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Connect DB
connectDB();

const app = express();

// ── Middleware ──
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
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
  console.log(`\n🚀 StudentFlow API running on port ${ENV.PORT}`);
  console.log(`📡 Environment: ${ENV.NODE_ENV}`);
  console.log(`🏥 Health: http://localhost:${ENV.PORT}/health`);
});

module.exports = app;
