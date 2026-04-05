import { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler.js";
import { RecordFilterQuery } from "../../utils/recordFilter.js";
import { CreateRecordBody, UpdateRecordBody } from "../../types/records.type.js";
import { createRecordService, hardDeleteRecordService, restoreRecordService, softDeleteRecordService, updateRecordService, viewAllRecordsService, viewRecordByIdService } from "./records.service.js";
import { AppError } from "../../utils/errors.js";

export const createRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const record = await createRecordService(req.body as CreateRecordBody, req.user!.id);

        return res.status(201).json({ 
            message: "Record created successfully", 
            record 
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const viewRecordById = async (req: Request, res: Response): Promise<Response> => {
    try {

        const record = await viewRecordByIdService(req.params.id as string);

        return res.status(200).json({ 
            message: "Record fetched successfully", 
            record 
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const viewAllRecords = async (req: Request, res: Response): Promise<Response> => {
    try {

        const data = await viewAllRecordsService(req.query as RecordFilterQuery);

        return res.status(200).json({ 
            message: "Records fetched successfully", 
            ...data 
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const updateRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const record = await updateRecordService(req.params.id as string, req.body as UpdateRecordBody);

        return res.status(200).json({ 
            message: "Record updated successfully", 
            record 
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const softDeleteRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const ids: string[] = req.body.ids ?? [req.params.id];

        if (!Array.isArray(ids) || ids.length === 0) {
            throw new AppError("At least one record ID is required", 400);
        }

        const deleted = await softDeleteRecordService(ids);

        return res.status(200).json({ 
            message: "Record deleted successfully", 
            deleted 
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const restoreRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const ids: string[] = req.body.ids ?? [req.params.id];

        if (!Array.isArray(ids) || ids.length === 0) {
            throw new AppError("At least one record ID is required", 400);
        }

        const restored = await restoreRecordService(ids);

        return res.status(200).json({
            message: "Record restored successfully",
            restored
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const deleteRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const ids: string[] = req.body.ids;

        if (!Array.isArray(ids) || ids.length === 0) {
            throw new AppError("At least one record ID is required", 400);
        }

        const deleted = await hardDeleteRecordService(ids);

        return res.status(200).json({
            message: "Records deleted successfully",
            deleted
        });

    } catch (error) {
        return handleError(error, res);
    }
};