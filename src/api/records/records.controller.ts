import { Request, Response } from "express"
import { FinancialRecord } from "./records.model.js";
import { CreateRecordBody } from "../../types/records.type.js";
import { handleError } from "../../utils/errorHandler.js";

export const createRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const body: CreateRecordBody = req.body;

        const record = await FinancialRecord.create({
            amount: body.amount,
            type: body.type,
            category: body.category,
            date: body.date,
            description: body.description as string,
            createdBy: req.user?.id as string,
        });

        return res.status(201).json({ message: "Record created successfully", record });

    } catch (error) {
        return handleError(error, res);
    }
}