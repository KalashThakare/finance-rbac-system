import { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler.js";
import { getCategoryBreakdownData, getDashboardData, getOverviewData, getRecentActivityData, getTrendsData } from "./dashboard.service.js";
import { AppError } from "../../utils/errors.js";
import { RecordFilterQuery } from "../../utils/recordFilter.js";

export const getOverview = async (req:Request, res:Response): Promise<Response> =>{
    try {

        const data = await getOverviewData(req.query as RecordFilterQuery);
        return res.status(200).json({ message: "Overview data fetched successfully", data });
    
    } catch (error) {
        return handleError(error, res);
    }
}

export const getCategoryBreakdown = async (req: Request, res: Response): Promise<Response> => {
    try {

        const data = await getCategoryBreakdownData(req.query as RecordFilterQuery);
        return res.status(200).json({ message: "Category breakdown fetched successfully", data });
    
    } catch (error) {
        return handleError(error, res);
    }
};

export const getTrends = async (req: Request, res: Response): Promise<Response> => {
    try {

        const period = req.query.period as string;

        if (period && !["monthly", "weekly"].includes(period)) {
            throw new AppError("Invalid period. Must be 'monthly' or 'weekly'", 400);
        }

        const data = await getTrendsData(
            (period as "monthly" | "weekly") || "monthly",
            req.query as RecordFilterQuery
        );

        return res.status(200).json({ message: "Trends fetched successfully", data });
    
    } catch (error) {
        return handleError(error, res);
    }
};

export const getRecentActivity = async (req: Request, res: Response): Promise<Response> => {
    try {

        const limit = Math.min(50, parseInt(req.query.limit as string) || 10); 
        const data = await getRecentActivityData(limit);
        
        return res.status(200).json({ message: "Recent activity fetched successfully", data });
    
    } catch (error) {
        return handleError(error, res);
    }
};

export const getDashboard = async (req: Request, res: Response): Promise<Response> => {
    try {

        const query = req.query as RecordFilterQuery & { period?: "monthly" | "weekly"; limit?: number };

        if (query.period && !["monthly", "weekly"].includes(query.period)) {
            throw new AppError("Invalid period. Must be 'monthly' or 'weekly'", 400);
        }

        const data = await getDashboardData(query);
        
        return res.status(200).json({ message: "Dashboard fetched successfully", data });
    
    } catch (error) {
        return handleError(error, res);
    }
};

