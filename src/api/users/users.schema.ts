import { z } from "zod";
import { UserRole, UserStatus } from "../../types/user.types.js";

const toLower = (val: unknown) => typeof val === "string" ? val.toLowerCase() : val;

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    role: z.preprocess(toLower, z.enum(Object.values(UserRole) as [string, ...string[]], { error: "Invalid role" })),
    status: z.preprocess(toLower, z.enum(Object.values(UserStatus) as [string, ...string[]], { error: "Invalid status" })).optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
});

export const updateStatusSchema = z.object({
    status: z.preprocess(toLower, z.enum(Object.values(UserStatus) as [string, ...string[]], { error: "Invalid status" })),
});

export const updateRoleSchema = z.object({
    role: z.preprocess(toLower, z.enum(Object.values(UserRole) as [string, ...string[]], { error: "Invalid role" })),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});