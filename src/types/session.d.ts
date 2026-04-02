import { User } from "./user.types.js";

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}