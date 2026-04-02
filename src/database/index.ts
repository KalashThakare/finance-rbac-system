import sequelize from "../config/db.js";
import { defineUserModel } from "../api/users/users.model.js";

const modelDefiners = [
    defineUserModel,
];

export const initModels = () => {
    modelDefiners.forEach((define) => define(sequelize));
};

export const syncModels = async (): Promise<void> => {
    const isDev = process.env.NODE_ENV === "development";

    try {
        await sequelize.sync({ alter: isDev, logging: false });
        console.log("All models synced.");
    } catch (error) {
        console.error("Model sync failed:", error);
        throw error;
    }
};

export { sequelize };