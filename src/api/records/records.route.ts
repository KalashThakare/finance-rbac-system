import express from "express";
import { createRecord, deleteRecord, updateRecord, viewAllRecords, viewRecordById } from "./records.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createRecordSchema, updateRecordSchema } from "./records.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { UserRole } from "../../types/user.types.js";

const router = express.Router();

router.use(authenticate);

router.post("/create", authorize([UserRole.ADMIN]), validate(createRecordSchema), createRecord);
router.get("/:id", viewRecordById);
router.get("/", viewAllRecords);
router.put("/:id", authorize([UserRole.ADMIN]), validate(updateRecordSchema), updateRecord);
router.delete("/:id", authorize([UserRole.ADMIN]), deleteRecord);


export default router;