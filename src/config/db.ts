import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const DB_URI = process.env.DATABASE_URI as string;

const sequelize = new Sequelize(DB_URI, {
    dialect: "postgres",
    protocol: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
    },
});

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Unable to connect Database:", error);
        process.exit(1);
    }
};

export default sequelize;