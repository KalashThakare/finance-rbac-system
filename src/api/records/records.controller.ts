import { Request, Response } from "express"
import { FinancialRecord, RECORD_ATTRIBUTE } from "./records.model.js";
import { CreateRecordBody, UpdateRecordBody } from "../../types/records.type.js";
import { handleError } from "../../utils/errorHandler.js";
import { AppError } from "../../utils/errors.js";
import { Pagination } from "../../utils/pagination.js";
import { recordFilter, RecordFilterQuery } from "../../utils/recordFilter.js";

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

export const viewRecordById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id as string;

        const record = await FinancialRecord.findByPk(id, {
            attributes: RECORD_ATTRIBUTE,
        });

        if (!record) {
            throw new AppError("Record not found", 404);
        }

        return res.status(200).json({ message: "Record fetched successfully", record });

    } catch (error) {
        return handleError(error, res);
    }
}

export const viewAllRecords = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { page, limit, type, category, startDate, endDate, minAmount, maxAmount } = req.query;
        const { parsedPage, parsedLimit, offset } = Pagination(page, limit);

        const whereClause = recordFilter({ type, category, startDate, endDate, minAmount, maxAmount } as RecordFilterQuery);

        const { count, rows } = await FinancialRecord.findAndCountAll({
            where: whereClause,
            attributes: RECORD_ATTRIBUTE,
            order: [["date", "DESC"]],
            limit: parsedLimit,
            offset,
        });

        return res.status(200).json({
            message: "Records fetched successfully",
            meta: {
                total: count,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(count / parsedLimit),
            },
            records: rows,
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const updateRecord = async (req:Request, res:Response): Promise<Response> =>{
    try {
        const id = req.params.id as string;
        const body: UpdateRecordBody = req.body;

        const record = await FinancialRecord.findByPk(id);

        if(!record){
            throw new AppError("record dosen't exist", 404 );
        }

        record.amount = body.amount ?? record.amount;
        record.type = body.type ?? record.type;
        record.category = body.category ?? record.category;
        record.date = body.date ?? record.date;
        record.description = body.description ?? record.description;

        await record.save();

        return res.status(200).json({ message: "Record updated successfully", record });    

    } catch (error) {
        return handleError(error, res);
    }
}

export const deleteRecord = async (req:Request, res:Response): Promise<Response> =>{
    try {
        const id = req.params.id as string;

        const record = await FinancialRecord.findByPk(id);

        if(!record){
            throw new AppError("record dosen't exist", 404 );
        }

        await record.destroy();

        return res.status(200).json({ message: "Record deleted successfully" });    

    } catch (error) {
        return handleError(error, res);
    }
}