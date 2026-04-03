import express from "express";
import { createRecord } from "./records.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createRecordSchema } from "./records.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";

const router = express.Router();

router.post("/create", authenticate, authorize([UserRole.ADMIN]), validate(createRecordSchema), createRecord);

export default router;