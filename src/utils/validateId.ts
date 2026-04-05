import { AppError } from "./errors.js";

export const validateFoundIds = (requestedIds: string[], foundIds: string[]): void => {
    const notFoundIds = requestedIds.filter(id => !foundIds.includes(id));
    if (notFoundIds.length > 0) {
        throw new AppError(`Records not found: ${notFoundIds.join(", ")}`, 404);
    }
};