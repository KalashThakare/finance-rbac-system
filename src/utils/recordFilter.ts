import { Op } from "sequelize";
import { RecordType } from "../types/records.type.js";
import { AppError } from "./errors.js";

export interface RecordFilterQuery {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
}

export const recordFilter = (query: RecordFilterQuery) => {
    const whereClause: Record<string, unknown> = {};

    // Type filter
    if (query.type) {
        if (!Object.values(RecordType).includes(query.type as RecordType)) {
            throw new AppError("Invalid type. Must be 'income' or 'expense'", 400);
        }
        whereClause.type = query.type;
    }

    // Category filter 
    if (query.category) {
        whereClause.category = query.category.trim().toLowerCase();
    }

    // Date range filter
    if (query.startDate || query.endDate) {
        const dateFilter: Record<string, Date> = {};

        if (query.startDate) {
            const start = new Date(query.startDate);
            if (isNaN(start.getTime())) throw new AppError("Invalid startDate format", 400);
            dateFilter[Op.gte as unknown as string] = start;
        }

        if (query.endDate) {
            const end = new Date(query.endDate);
            if (isNaN(end.getTime())) throw new AppError("Invalid endDate format", 400);
            dateFilter[Op.lte as unknown as string] = end;
        }

        whereClause.date = dateFilter;
    }

    // Amount range filter 
    if (query.minAmount || query.maxAmount) {
        const amountFilter: Record<string, number> = {};

        if (query.minAmount) {
            const min = parseFloat(query.minAmount);
            if (isNaN(min) || min < 0) throw new AppError("Invalid minAmount", 400);
            amountFilter[Op.gte as unknown as string] = min;
        }

        if (query.maxAmount) {
            const max = parseFloat(query.maxAmount);
            if (isNaN(max) || max < 0) throw new AppError("Invalid maxAmount", 400);
            amountFilter[Op.lte as unknown as string] = max;
        }

        whereClause.amount = amountFilter;
    }

    return whereClause;
};