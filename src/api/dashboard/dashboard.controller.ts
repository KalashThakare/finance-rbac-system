import { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler.js";
import { getOverviewData } from "./dashboard.service.js";

export const overview = async (req:Request, res:Response): Promise<Response> =>{
    try {

        const data = await getOverviewData();
        return res.status(200).json({ message: "Overview data fetched successfully", data });
    
    } catch (error) {
        return handleError(error, res);
    }
}