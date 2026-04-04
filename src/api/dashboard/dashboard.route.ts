import express from "express";
import { overview } from "./dashboard.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize([UserRole.ADMIN, UserRole.ANALYST]))

router.get("/", overview);

export default router;      