import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errorMessages
            });
        }

        req.body = result.data;
        next();
    };
};