import { FinancialRecord, RECORD_ATTRIBUTE } from "./records.model.js";
import { CreateRecordBody, PaginatedRecordQuery, PaginatedResult, UpdateRecordBody } from "../../types/records.type.js";
import { AppError } from "../../utils/errors.js";
import { Pagination } from "../../utils/pagination.js";
import { recordFilter } from "../../utils/recordFilter.js";
import { Op } from "sequelize";
import { validateFoundIds } from "../../utils/validateId.js";


export const createRecordService = async (body: CreateRecordBody, userId: string): Promise<FinancialRecord> => {

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

export const viewRecordByIdService = async (id: string): Promise<FinancialRecord> => {

    const record = await FinancialRecord.findByPk(id, {
        attributes: RECORD_ATTRIBUTE,
    });

    if (!record){
        throw new AppError("Record not found", 404);
    }

    return record;

};

export const viewAllRecordsService = async (query: PaginatedRecordQuery ):Promise<PaginatedResult> => {

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

export const updateRecordService = async (id: string, body: UpdateRecordBody): Promise<FinancialRecord> => {

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

export const softDeleteRecordService = async (ids: string[]): Promise<number> => {
    
    const records = await FinancialRecord.findAll({
        where: { id: { [Op.in]: ids } },
    });

    if (records.length === 0) throw new AppError("No records found", 404);

    validateFoundIds(ids, records.map(r => r.id));

    await FinancialRecord.destroy({
        where: { id: { [Op.in]: ids } },
    });

    return ids.length;
};

export const restoreRecordService = async (ids: string[]): Promise<number> => {

    const records = await FinancialRecord.findAll({
        where: { id: { [Op.in]: ids } },
        paranoid: false,
    });

    if (records.length === 0) throw new AppError("No records found", 404);

    validateFoundIds(ids, records.map(r => r.id));

    const notDeletedIds = records
        .filter(r => !r.deletedAt)
        .map(r => r.id);
    if (notDeletedIds.length > 0) {
        throw new AppError(`Records are not deleted: ${notDeletedIds.join(", ")}`, 400);
    }

    await FinancialRecord.restore({
        where: { id: { [Op.in]: ids } },
    });

    return ids.length;
};

export const hardDeleteRecordService = async (ids: string[]): Promise<number> => {

    const records = await FinancialRecord.findAll({
        where: { id: { [Op.in]: ids } },
        paranoid: false,
    });

    if (records.length === 0) throw new AppError("No records found", 404);

    validateFoundIds(ids, records.map(r => r.id));

    await FinancialRecord.destroy({
        where: { id: { [Op.in]: ids } },
        force: true,
    });

    return ids.length;
};
