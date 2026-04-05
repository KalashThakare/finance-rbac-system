import { Optional } from "sequelize";

// Enums

export enum UserRole {
    ADMIN = "admin",
    VIEWER = "viewer",
    ANALYST = "analyst",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
}

// attributes

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    createdBy: string;
    createdAt?: Date;
    deletedAt?: Date | null;
    updatedAt?: Date;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> { }

// response

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdBy: string;
    createdAt: Date;
}

// Request

export interface CreateUserBody {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    status?: UserStatus;  // optional, defaults to ACTIVE
}

export interface UpdateUserBody {
    name?: string;
    email?: string;
}

export interface UpdateStatusBody {
    status: UserStatus;
}

export interface UpdateRoleBody {
    role: UserRole;
}

export interface UpdatePasswordBody {
    password: string;
}   