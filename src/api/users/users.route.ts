import express from "express";
import { createUser, getUserById, getUsers, resetPassword, updateRole, updateStatus } from "./users.controller.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = express.Router();

router.post("/create", authenticate, authorize([UserRole.ADMIN]), createUser);

router.get("/", authenticate, authorize([UserRole.ADMIN]), getUsers);

router.put("/update-status/:id", authenticate, authorize([UserRole.ADMIN]), updateStatus);

router.put("/update-role/:id", authenticate, authorize([UserRole.ADMIN]), updateRole);

router.put("/reset-password", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), resetPassword);

router.get("/:id", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), getUserById);

export default router;