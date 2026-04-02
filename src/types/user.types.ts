import { Optional } from "sequelize";

// Enums

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
}

// attributes

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    createdBy: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> { }

// response

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdBy: number;
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
    role?: UserRole;
    status?: UserStatus;
}