import express from "express";
import { createUser, getUserById, getUsers, resetPassword, updateRole, updateStatus } from "./users.controller.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { createUserSchema, resetPasswordSchema, updateRoleSchema, updateStatusSchema } from "./users.schema.js";
import { validate } from "../../middlewares/validate.js";

const router = express.Router();

router.post("/create", authenticate, authorize([UserRole.ADMIN]), validate(createUserSchema), createUser);

router.get("/", authenticate, authorize([UserRole.ADMIN]), getUsers);

router.put("/update-status/:id", authenticate, authorize([UserRole.ADMIN]), validate(updateStatusSchema), updateStatus);

router.put("/update-role/:id", authenticate, authorize([UserRole.ADMIN]), validate(updateRoleSchema), updateRole);

router.put("/reset-password", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), validate(resetPasswordSchema), resetPassword);

router.get("/:id", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), getUserById);

export default router;