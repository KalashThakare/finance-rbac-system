import { User } from "../../api/users/users.model.js";
import sequelize, { connectDB } from "../../config/db.js";
import { UserRole, UserStatus } from "../../types/user.types.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { initModels } from "../index.js";

dotenv.config();

async function seedAdmin() {
    try {
        await connectDB();
        initModels();

        await sequelize.sync({ alter: true });

        const admin = await User.findOne({
            where: {
                role: UserRole.ADMIN
            }
        });

        if (admin) {
            console.log("admin already exists.");
            return;
        }
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS as string, 12);
        await User.create({
            name: process.env.ADMIN_NAME as string,
            email: process.env.ADMIN_EMAIL as string,
            password: hashedPassword,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            createdBy: 1,
        });
        console.log("admin created successfully.");

    } catch (error) {
        console.error("seed failed", error);
        process.exit(1);
    } finally {
        sequelize.close();
    }

}

seedAdmin();    