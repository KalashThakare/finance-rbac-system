import { Request, Response } from "express";
import { User } from "./users.model.js";
import { CreateUserBody, UpdatePasswordBody, UpdateRoleBody, UpdateStatusBody, UserResponse, UserRole, UserStatus } from "../../types/user.types.js";
import { handleError } from "../../utils/errorHandler.js";
import { AppError } from "../../utils/errors.js";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body: CreateUserBody = req.body;

        const existingUser = await User.count({ where: { email: body.email } });
        if (existingUser > 0) {
            throw new AppError("User already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);

        const user = await User.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role as UserRole,
            status: (body.status || UserStatus.ACTIVE) as UserStatus,
            createdBy: req.user!.id
        });

        const response: UserResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
        };

        return res.status(201).json({ message: "User created successfully", user: response });
    } catch (error) {
        return handleError(error, res);
    }
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {

        const users = await User.findAll();

        const response: UserResponse[] = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
        }));

        return res.status(200).json({ message: "Users fetched successfully", users: response });
    } catch (error) {
        return handleError(error, res);
    }
}

export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.params.id as string;
        const body: UpdateStatusBody = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.status = body.status;
        await user.save();

        return res.status(200).json({
            message: "User status updated successfully",
            status: user.status,
        });

    } catch (error) {
        return handleError(error, res);
    }
};

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.params.id as string;
        const body: UpdateRoleBody = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.role = body.role;
        await user.save();

        return res.status(200).json({ message: "User role updated successfully", role: user.role });

    } catch (error) {
        return handleError(error, res);
    }
}

export const getMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.user!.id;

        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const response: UserResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
        };

        return res.status(200).json({ message: "Profile fetched successfully", user: response });
    } catch (error) {
        return handleError(error, res);
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.params.id as string;

        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const response: UserResponse = {
            id: user.id,
            name: user.email,
            email: user.email,
            role: user.role,
            status: user.status,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
        };

        return res.status(200).json({ message: "User fetched successfully", user: response });

    } catch (error) {
        return handleError(error, res);
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.user!.id;
        const body: UpdatePasswordBody = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.password = await bcrypt.hash(body.password, 12);
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        return handleError(error, res);
    }
}