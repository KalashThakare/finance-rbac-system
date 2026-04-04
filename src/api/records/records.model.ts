import { DataTypes, Model, Sequelize } from "sequelize";
import { FinancialRecordAttributes, FinancialRecordCreationAttributes, RecordType } from "../../types/records.type.js";

export class FinancialRecord extends Model<FinancialRecordAttributes, FinancialRecordCreationAttributes> {
    declare id: string;
    declare amount: number;
    declare type: RecordType;
    declare category: string;
    declare date: Date;
    declare description: string;
    declare createdBy: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

export const RECORD_ATTRIBUTE = ["id", "amount", "type", "category", "date", "description", "createdBy", "createdAt"];

export function defineFinancialRecordModel(sequelize: Sequelize) {
    FinancialRecord.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM(...Object.values(RecordType)),
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,          
            },
            createdBy: {
                type: DataTypes.UUID,
                allowNull: true,                      
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "SET NULL",                   
                onUpdate: "CASCADE",
            },
        },
        {
            sequelize,
            tableName: "records",
            indexes: [
                { fields: ["createdBy"] },
                { fields: ["type"] },           
                { fields: ["category"] },         
                { fields: ["date"] },     
                { fields: ["type", "category"] },       
                { fields: ["type", "date"] },
            ],
        }
    );
}