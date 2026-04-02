import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes, UserRole, UserStatus } from "../../types/user.types.js";

export class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: UserRole;
    declare status: UserStatus;
    declare createdBy: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

export function defineUserModel(sequelize: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
                defaultValue: UserRole.USER,
            },
            status: {
                type: DataTypes.ENUM(...Object.values(UserStatus)),
                allowNull: false,
                defaultValue: UserStatus.ACTIVE,
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "users",
        }
    );
}
