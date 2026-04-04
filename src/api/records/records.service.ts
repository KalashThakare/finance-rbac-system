import { FinancialRecord, RECORD_ATTRIBUTE } from "./records.model.js";
import { CreateRecordBody, UpdateRecordBody } from "../../types/records.type.js";
import { AppError } from "../../utils/errors.js";
import { Pagination } from "../../utils/pagination.js";
import { recordFilter, RecordFilterQuery } from "../../utils/recordFilter.js";

export const createRecordService = async (body: CreateRecordBody, userId: string) => {

    const record = await FinancialRecord.create({
        amount: body.amount,
        type: body.type,
        category: body.category.trim().toLowerCase(),   
        date: body.date,
        description: body.description?.trim() as string,
        createdBy: userId,
    });

    return record;
};

export const viewRecordByIdService = async (id: string) => {

    const record = await FinancialRecord.findByPk(id, {
        attributes: RECORD_ATTRIBUTE,
    });

    if (!record){
        throw new AppError("Record not found", 404);
    }

    return record;

};

export const viewAllRecordsService = async (query: RecordFilterQuery & { page?: unknown; limit?: unknown }) => {

    const { parsedPage, parsedLimit, offset } = Pagination(query.page, query.limit);

    const whereClause = recordFilter(query);

    const { count, rows } = await FinancialRecord.findAndCountAll({
        where: whereClause,
        attributes: RECORD_ATTRIBUTE,
        order: [["date", "DESC"]],
        limit: parsedLimit,
        offset,
    });

    return {
        meta: {
            total: count,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(count / parsedLimit),
        },
        records: rows,
    };
};

export const updateRecordService = async (id: string, body: UpdateRecordBody) => {

    const record = await FinancialRecord.findByPk(id);

    if (!record) throw new AppError("Record not found", 404);

    const allowedFields = ["amount", "type", "category", "date", "description"] as const;

    const updates = Object.fromEntries(
        allowedFields
            .filter(field => body[field] !== undefined)
            .map(field => [field, body[field]])
    );

    if (Object.keys(updates).length === 0) {
        throw new AppError("No fields provided to update", 400);
    }

    if (updates.category) {
        updates.category = (updates.category as string).trim().toLowerCase(); 
    }

    Object.assign(record, updates);
    await record.save();

    return record;
};

export const deleteRecordService = async (id: string) => {

    const record = await FinancialRecord.findByPk(id);

    if (!record) throw new AppError("Record not found", 404);

    await record.destroy();
};