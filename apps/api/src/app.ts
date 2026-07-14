import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimiter.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import plotRoutes from "./routes/plotRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";
import irrigationRoutes from "./routes/irrigationRoutes.js";
import plantingRoutes from "./routes/plantingRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";

const app: Application = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://agro-sistema.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[DEBUG] Rota acessada: ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/", apiLimiter);

app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/plots", plotRoutes);
app.use("/finance", financeRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/machines", machineRoutes);
app.use("/operators", operatorRoutes);
app.use("/harvests", harvestRoutes);
app.use("/irrigations", irrigationRoutes);
app.use("/plantings", plantingRoutes);
app.use("/documents", documentRoutes);
app.use("/reports", reportRoutes);
app.use("/audit", auditRoutes);
app.use("/settings", settingRoutes);
app.use("/", dashboardRoutes);

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

export default app;