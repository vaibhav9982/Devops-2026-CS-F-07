import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import project from "./routes/project.routes.js";
import ApiError from "./utils/ApiError.js";
import cookieParser from"cookie-parser";
import { errorHandler } from "./middleware/ErrorHandler.js";
import { connectDb } from "./config/db.js";
import { metricsRegistry, recordHttpMetrics } from "./metrics.js";


const app = express();
await connectDb();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(recordHttpMetrics);

app.use("/api/v1",indexRoutes);
app.use("/api",authRoutes)
app.use("/api/v1",project);

app.get("/metrics", async (_req, res, next) => {
  try {
    res.set("Content-Type", metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Code Visualizer Backend API is running ",
  });
});

app.use(errorHandler);

export default app;