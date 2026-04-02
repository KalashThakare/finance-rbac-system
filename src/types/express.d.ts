import { UserRole, UserStatus } from "./user.types.js";

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

declare global {
    namespace Express {
        interface Request {
            user?: SessionUser;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        user?: SessionUser;
    }
}