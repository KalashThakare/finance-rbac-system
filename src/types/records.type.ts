import { Optional } from "sequelize";
import { RecordFilterQuery } from "../utils/recordFilter.js";
import { FinancialRecord } from "../api/records/records.model.js";

// enums
export enum RecordType {
    INCOME = "income",
    EXPENSE = "expense",
}

// attributes
export interface FinancialRecordAttributes {
    id: string;
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    description: string;
    createdBy: string;
    deletedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FinancialRecordCreationAttributes
    extends Optional<FinancialRecordAttributes, "id" | "createdAt" | "updatedAt"> { }

// response

export interface FinancialRecordResponse {
    id: string;
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    description: string;
    createdBy: string;
    createdAt: Date;
}

export interface CreateRecordBody {
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    description?: string;
}

export interface UpdateRecordBody {
    amount?: number;
    type?: RecordType;
    category?: string;
    date?: Date;
    description?: string;
}

export interface PaginatedRecordQuery extends RecordFilterQuery {
    page?: string;
    limit?: string;
}

export interface PaginatedResult {
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    records: FinancialRecord[];
}

