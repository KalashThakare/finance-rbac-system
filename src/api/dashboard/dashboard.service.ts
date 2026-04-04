import { fn, col, literal } from "sequelize";
import { FinancialRecord } from "../records/records.model.js";
import { RecordType } from "../../types/records.type.js";
import { recordFilter, RecordFilterQuery } from "../../utils/recordFilter.js";

export const getOverviewData = async (query: RecordFilterQuery) => {

    const whereClause = recordFilter(query);

    const [income, expense] = await Promise.all([
        FinancialRecord.findOne({
            where: { ...whereClause, type: RecordType.INCOME },
            attributes: [[fn("SUM", col("amount")), "total"]],
            raw: true,
        }) as unknown as Promise<{ total: string } | null>,

        FinancialRecord.findOne({
            where: { ...whereClause, type: RecordType.EXPENSE },
            attributes: [[fn("SUM", col("amount")), "total"]],
            raw: true,
        }) as unknown as Promise<{ total: string } | null>,
    ]);

    const totalIncome = parseFloat(income?.total ?? "0");
    const totalExpense = parseFloat(expense?.total ?? "0");
    const netBalance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        netBalance,
        status: netBalance >= 0 ? "profit" : "loss",
    };
};

export const getCategoryBreakdownData = async(query: RecordFilterQuery) =>{

    const whereClause = recordFilter(query);

    const breakdown = await FinancialRecord.findAll({
        where: whereClause,
        attributes:[
            "category",
            "type",
            [fn("SUM", col("amount")), "total"],
            [fn("COUNT", col("id")), "count"],
        ],
        group: ["category", "type"],
        order: [[fn("SUM", col("amount")), "DESC"]],
        raw: true
    }) as unknown as { category: string; type: string; total: string; count: string }[];

    return breakdown.map(item=>({
        category: item.category,
        type: item.type,
        total: parseFloat(item.total),
        count: parseInt(item.count),
    }));
};

export const getRecentActivityData = async(limit: number = 10) =>{

    const records = await FinancialRecord.findAll({
        attributes: ["id", "amount", "type", "category", "date", "description", "createdBy"],
        order: [["date", "DESC"]],
        limit,
        raw: true,
    });

    return records;
}

export const getTrendsData = async (period: "monthly" | "weekly", query: RecordFilterQuery) =>{

    const whereClause = recordFilter(query);

    const truncBy = period === "monthly" ? "month" : "week";

    const trends = await FinancialRecord.findAll({
        where: whereClause,
        attributes: [
            [fn("DATE_TRUNC", truncBy, col("date")), "period"],
            "type",
            [fn("SUM", col("amount")), "total"],
            [fn("COUNT", col("id")), "count"],
        ],
        group: [fn("DATE_TRUNC", truncBy, col("date")), "type"],
        order: [[fn("DATE_TRUNC", truncBy, col("date")), "ASC"]],
        raw: true,
    }) as unknown as { period: string; type: string; total: string; count: string }[];

    return trends.map(item => ({
        period: item.period,
        type: item.type,
        total: parseFloat(item.total),
        count: parseInt(item.count),
    }));

}

export const getDashboardData = async (query: RecordFilterQuery & { period?: "monthly" | "weekly"; limit?: number }) => {
    
    const period = query.period || "monthly";
    const limit = Math.min(50, query.limit || 10);

    const [overview, categoryBreakdown, trends, recentActivity] = await Promise.all([
        getOverviewData(query),
        getCategoryBreakdownData(query),
        getTrendsData(period, query),
        getRecentActivityData(limit),
    ]);

    return {
        overview,
        categoryBreakdown,
        trends,
        recentActivity,
    };
};

