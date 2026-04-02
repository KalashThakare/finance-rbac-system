import express from "express";
import dotenv from "dotenv";
import { sessionMiddleware } from "./config/session.js";
import userRoutes from "./api/users/users.route.js";
import authRoutes from "./api/auth/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

export default app;