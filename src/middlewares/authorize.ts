import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types/user.types.js";

export const authorize = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            console.error("Unauthorised");
            return res.status(401).json({ message: "Unauthorised" });
        }
        if (!roles.includes(user.role)) {
            console.error("Forbidden");
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }
}