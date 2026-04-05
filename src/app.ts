import express from "express";
import dotenv from "dotenv";
import { sessionMiddleware } from "./config/session.js";
import userRoutes from "./api/users/users.route.js";
import authRoutes from "./api/auth/auth.route.js";
import recordRoutes from "./api/records/records.route.js";
import dashboardRoutes from "./api/dashboard/dashboard.route.js";
import { generalLimiter } from "./config/rateLimiter.js";

dotenv.config();

const app = express();

app.use(generalLimiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes)

export default app;