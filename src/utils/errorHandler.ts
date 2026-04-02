import { Response } from "express";
import { AppError } from "./errors.js";
import { ValidationError, UniqueConstraintError } from "sequelize";

export const handleError = (error: unknown, res: Response): Response => {

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors.map((e) => e.message),
        });
    }

    // Duplicate entry
    if (error instanceof UniqueConstraintError) {
        return res.status(409).json({ message: "Resource already exists" });
    }

    // Unknown error
    console.error("[Unhandled Error]", error);
    return res.status(500).json({ message: "Internal server error" });
};