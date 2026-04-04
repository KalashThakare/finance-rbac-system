import { fn, col } from "sequelize";
import { FinancialRecord } from "../records/records.model.js";
import { RecordType } from "../../types/records.type.js";

export const getOverviewData = async () => {

    const [income, expense] = await Promise.all([

        FinancialRecord.findOne({
            where: { type: RecordType.INCOME },
            attributes: [[fn("SUM", col("amount")), "total"]],
            raw: true,
        }),

        FinancialRecord.findOne({
            where: { type: RecordType.EXPENSE },
            attributes: [[fn("SUM", col("amount")), "total"]],
            raw: true,
        }),

    ]);

    const totalIncome = parseFloat((income as any)?.total ?? "0");
    const totalExpense = parseFloat((expense as any)?.total ?? "0");
    const netBalance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        netBalance,
        status: netBalance >= 0 ? "profit" : "loss",
    };
};