import { Request, Response, NextFunction } from "express";
import { UserStatus } from "../types/user.types.js";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!req.session) {
            res.status(401).json({ message: "No session found." });
            return;
        }

        if (!req.session.user) {
            res.status(401).json({ message: "Unauthorized. Please login." });
            return;
        }

        if (req.session.user.status === UserStatus.BANNED) {
            req.session.destroy(() => { });
            res.status(403).json({ message: "Your account has been banned." });
            return;
        }

        if (req.session.user.status === UserStatus.INACTIVE) {
            req.session.destroy(() => { });
            res.status(403).json({ message: "Your account is inactive." });
            return;
        }

        req.user = req.session.user;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};