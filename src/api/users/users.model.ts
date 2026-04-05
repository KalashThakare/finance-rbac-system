import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes, UserRole, UserStatus } from "../../types/user.types.js";

export class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: UserRole;
    declare status: UserStatus;
    declare createdBy: string;
    declare deletedAt?: Date | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

export function defineUserModel(sequelize: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM(...Object.values(UserRole)),
                allowNull: false,
                defaultValue: UserRole.VIEWER,
            },
            status: {
                type: DataTypes.ENUM(...Object.values(UserStatus)),
                allowNull: false,
                defaultValue: UserStatus.ACTIVE,
            },
            createdBy: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            sequelize,
            tableName: "users",
            paranoid:true,
            indexes: [
                { unique: true, fields: ["email"] },
            ],
        }
    );
}