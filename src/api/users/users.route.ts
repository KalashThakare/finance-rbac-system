import express from "express";
import { createUser, getUserById, getUsers, hardDeleteUser, resetPassword, restoreUser, softDeleteUser, updateRole, updateStatus } from "./users.controller.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { createUserSchema, resetPasswordSchema, updateRoleSchema, updateStatusSchema } from "./users.schema.js";
import { validate } from "../../middlewares/validate.js";

const router = express.Router();

router.use(authenticate);

router.post("/create", authorize([UserRole.ADMIN]), validate(createUserSchema), createUser);
router.get("/", authorize([UserRole.ADMIN]), getUsers);
router.put("/update-status/:id", authorize([UserRole.ADMIN]), validate(updateStatusSchema), updateStatus);
router.put("/update-role/:id", authorize([UserRole.ADMIN]), validate(updateRoleSchema), updateRole);
router.put("/reset-password", authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), validate(resetPasswordSchema), resetPassword);
router.get("/:id", authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), getUserById);
router.delete("/soft-delete/:id", authorize([UserRole.ADMIN]), softDeleteUser);
router.patch("/restore/:id", authorize([UserRole.ADMIN]), restoreUser);
router.delete("/:id", authorize([UserRole.ADMIN]), hardDeleteUser);

export default router;