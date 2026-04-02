import express from "express";
import { createUser } from "./users.controller.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = express.Router();

router.post("/create", authenticate, authorize([UserRole.ADMIN]), createUser);

export default router;