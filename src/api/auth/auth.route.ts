import express from "express";
import { login, logout } from "./auth.controller.js";
import { authLimiter } from "../../config/rateLimiter.js";

const router = express.Router();

router.use(authLimiter);

router.post("/login", login);

router.post("/logout", logout);

export default router;