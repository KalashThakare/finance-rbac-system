import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

const createLimiter = (max: number, windowMinutes: number = 15, message: string): RateLimitRequestHandler => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max,
        message: message,
        standardHeaders: true,
        legacyHeaders: false,
    });
};

export const authLimiter = createLimiter(5, 15, "Too many login attempts, please try again later.");
export const generalLimiter = createLimiter(100, 15, "Too many requests, please try again later.");