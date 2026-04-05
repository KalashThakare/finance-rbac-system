import { Request, Response, NextFunction } from "express";
import { UserStatus } from "../types/user.types.js";
import { User } from "../api/users/users.model.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        if (!req.session) {
            res.status(401).json({ message: "No session found." });
            return;
        }

        if (!req.session.user) {
            res.status(401).json({ message: "Unauthorized. Please login." });
            return;
        }

        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            req.session.destroy(() => {});
            res.status(401).json({ message: "Account no longer exists." });
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