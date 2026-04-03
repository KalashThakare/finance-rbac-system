export const Pagination = (page: unknown, limit: unknown) => {
    const parsedPage = Math.max(1, parseInt(page as string) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const offset = (parsedPage - 1) * parsedLimit;
    return { parsedPage, parsedLimit, offset };
};