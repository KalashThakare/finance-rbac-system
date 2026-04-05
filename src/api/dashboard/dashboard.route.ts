import express from "express";
import { getCategoryBreakdown, getDashboard, getOverview, getRecentActivity, getTrends } from "./dashboard.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize([UserRole.ADMIN, UserRole.ANALYST]), getDashboard);
router.get("/summary", authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), getOverview);
router.get("/categories", authorize([UserRole.ADMIN, UserRole.ANALYST]), getCategoryBreakdown);
router.get("/trends", authorize([UserRole.ADMIN, UserRole.ANALYST]), getTrends);
router.get("/recent", authorize([UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER]), getRecentActivity);

export default router;