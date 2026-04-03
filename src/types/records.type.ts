import { Optional } from "sequelize";

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