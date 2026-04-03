import express from "express";
import { createRecord, updateRecord, viewAllRecords, viewRecordById } from "./records.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createRecordSchema, updateRecordSchema } from "./records.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";

const router = express.Router();

router.post("/create", authenticate, authorize([UserRole.ADMIN]), validate(createRecordSchema), createRecord);
router.get("/:id", authenticate, viewRecordById);
router.get("/", authenticate, viewAllRecords);
router.put("/:id", authenticate, authorize([UserRole.ADMIN]), validate(updateRecordSchema), updateRecord);


export default router;