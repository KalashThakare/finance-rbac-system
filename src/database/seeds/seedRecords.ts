import { FinancialRecord } from "../../api/records/records.model.js";
import { User } from "../../api/users/users.model.js";
import sequelize, { connectDB } from "../../config/db.js";
import { RecordType } from "../../types/records.type.js";
import { initModels } from "../index.js";
import dotenv from "dotenv";

dotenv.config();

const records = [
    // Q1 - January
    { amount: 120000, type: RecordType.INCOME, category: "revenue", date: new Date("2026-01-05"), description: "Client contract payment - Q1" },
    { amount: 45000, type: RecordType.EXPENSE, category: "payroll", date: new Date("2026-01-31"), description: "January payroll" },
    { amount: 12000, type: RecordType.EXPENSE, category: "infrastructure", date: new Date("2026-01-10"), description: "Cloud hosting and servers" },
    { amount: 8000, type: RecordType.EXPENSE, category: "office", date: new Date("2026-01-01"), description: "Office rent" },
    { amount: 30000, type: RecordType.INCOME, category: "consulting", date: new Date("2026-01-20"), description: "Strategy consulting engagement" },

    // Q1 - February
    { amount: 95000, type: RecordType.INCOME, category: "revenue", date: new Date("2026-02-07"), description: "Product license renewals" },
    { amount: 45000, type: RecordType.EXPENSE, category: "payroll", date: new Date("2026-02-28"), description: "February payroll" },
    { amount: 8000, type: RecordType.EXPENSE, category: "office", date: new Date("2026-02-01"), description: "Office rent" },
    { amount: 5000, type: RecordType.EXPENSE, category: "software", date: new Date("2026-02-12"), description: "SaaS tools and subscriptions" },
    { amount: 15000, type: RecordType.INCOME, category: "consulting", date: new Date("2026-02-18"), description: "Technical advisory fee" },

    // Q1 - March
    { amount: 140000, type: RecordType.INCOME, category: "revenue", date: new Date("2026-03-05"), description: "Enterprise client payment" },
    { amount: 45000, type: RecordType.EXPENSE, category: "payroll", date: new Date("2026-03-31"), description: "March payroll" },
    { amount: 8000, type: RecordType.EXPENSE, category: "office", date: new Date("2026-03-01"), description: "Office rent" },
    { amount: 20000, type: RecordType.EXPENSE, category: "marketing", date: new Date("2026-03-15"), description: "Q1 marketing campaign" },
    { amount: 7000, type: RecordType.EXPENSE, category: "travel", date: new Date("2026-03-22"), description: "Client onsite visits" },
];

async function seedRecords() {
    try {
        await connectDB();
        initModels();

        await sequelize.sync({ alter: true });

        const admin = await User.findOne({ where: { role: "admin" } });

        if (!admin) {
            console.error("No admin found. Run yarn seed:admin first.");
            process.exit(1);
        }

        const existing = await FinancialRecord.count();
        if (existing > 0) {
            console.log("Records already exist. Skipping seed.");
            return;
        }

        await FinancialRecord.bulkCreate(
            records.map((r) => ({ ...r, createdBy: admin.id }))
        );

        console.log(`${records.length} records seeded successfully.`);

    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    } finally {
        sequelize.close();
    }
}

seedRecords();