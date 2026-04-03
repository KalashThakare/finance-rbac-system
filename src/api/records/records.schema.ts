import { z } from "zod";
import { RecordType } from "../../types/records.type.js";

const toLower = (val: unknown) => typeof val === "string" ? val.toLowerCase() : val;

export const createRecordSchema = z.object({
    amount: z.number({ error: "Amount must be a number" }).positive("Amount must be positive"),
    type: z.preprocess(toLower, z.enum(Object.values(RecordType) as [string, ...string[]], { error: "Type must be income or expense" })),
    category: z.string().min(1, "Category is required"),
    date: z.coerce.date({ error: "Invalid date format" }),
    description: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema.partial();