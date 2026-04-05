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
            console.log("Admin already exists. Skipping seed.");
            return;
        }

        const name = "testUser";
        const email = "admin@company.com";
        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            createdBy: "00000000-0000-0000-0000-000000000000",
        });

        console.log(`Admin created successfully.`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

seedAdmin();