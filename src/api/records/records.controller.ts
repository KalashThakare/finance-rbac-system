import { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler.js";
import { RecordFilterQuery } from "../../utils/recordFilter.js";
import { CreateRecordBody, UpdateRecordBody } from "../../types/records.type.js";
import { createRecordService, deleteRecordService, updateRecordService, viewAllRecordsService, viewRecordByIdService } from "./records.service.js";

export const createRecord = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        const record = await createRecordService(req.body as CreateRecordBody, req.user!.id);
        
        return res.status(201).json({ message: "Record created successfully", record });
    
    } catch (error) {
        return handleError(error, res);
    }
};

export const viewRecordById = async (req: Request, res: Response): Promise<Response> => {
    try {

        const record = await viewRecordByIdService(req.params.id as string);
        
        return res.status(200).json({ message: "Record fetched successfully", record });
    
    } catch (error) {
        return handleError(error, res);
    }
};

export const viewAllRecords = async (req: Request, res: Response): Promise<Response> => {
    try {

        const data = await viewAllRecordsService(req.query as RecordFilterQuery);
        
        return res.status(200).json({ message: "Records fetched successfully", ...data });
    
    } catch (error) {
        return handleError(error, res);
    }
};

export const updateRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        const record = await updateRecordService(req.params.id as string, req.body as UpdateRecordBody);

        return res.status(200).json({ message: "Record updated successfully", record });

    } catch (error) {
        return handleError(error, res);
    }
};

export const deleteRecord = async (req: Request, res: Response): Promise<Response> => {
    try {

        await deleteRecordService(req.params.id as string);

        return res.status(200).json({ message: "Record deleted successfully" });

    } catch (error) {
        return handleError(error, res);
    }
};