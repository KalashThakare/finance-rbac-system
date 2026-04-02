import { Request, Response } from "express";
import { User } from "./users.model.js";
import { CreateUserBody, UpdatePasswordBody, UpdateRoleBody, UpdateStatusBody, UpdateUserBody, UserResponse, UserRole, UserStatus } from "../../types/user.types.js";
import { handleError } from "../../utils/errorHandler.js";
import { AppError } from "../../utils/errors.js";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        const body: CreateUserBody = req.body;
        if (!body.name || !body.email || !body.password || !body.role) {
            throw new AppError("all fields are required", 400);
        }

        //Lower case the role and status
        const role = body.role.toLowerCase() as UserRole;
        const status = (body.status || UserStatus.ACTIVE).toLowerCase() as UserStatus;

        if (!Object.values(UserRole).includes(role)) {
            throw new AppError("invalid role", 400);
        }

        if (!Object.values(UserStatus).includes(status)) {
            throw new AppError("invalid status", 400);
        }

        const existingUser = await User.count({
            where: {
                email: body.email
            }
        });

        if (existingUser > 0) {
            throw new AppError("User already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);

        const user = await User.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role,
            status,
            createdBy: req.user?.id as string
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
        if (!body.status) {
            throw new AppError("Status is required", 400);
        }

        const status = body.status.toLowerCase() as UserStatus;
        if (!Object.values(UserStatus).includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.status = status;
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

        const { id } = req.params;
        const body: UpdateRoleBody = req.body;
        if (!body.role) {
            throw new AppError("role is required", 400);
        }

        const role = body.role.toLowerCase() as UserRole;
        if (!Object.values(UserRole).includes(role)) {
            throw new AppError("Invalid role", 400);
        }
        const [count, rows] = await User.update(
            { role },
            {
                where: {
                    id
                },
                returning: true
            });

        if (count === 0) {
            throw new AppError("User not found", 404);
        }

        const updatedUser = rows[0];
        if (!updatedUser) {
            throw new AppError("User not found", 404);
        }

        return res.status(200).json({ message: "User role updated successfully", role: updatedUser.role });

    } catch (error) {
        return handleError(error, res);
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Non-admins can only view their own profile
        if (req.user!.role !== UserRole.ADMIN && req.user!.id !== id) {
            throw new AppError("You are not authorized to view another user's profile", 403);
        }

        const user = await User.findByPk(id as string);
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

        return res.status(200).json({ message: "User fetched successfully", user: response });

    } catch (error) {
        return handleError(error, res);
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const body: UpdatePasswordBody = req.body;
        const id = req.user?.id as string;

        if (!body.password) {
            throw new AppError("password is required", 400);
        }

        const pass = await bcrypt.hash(body.password, 12);

        const user = await User.findByPk(id as string);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.password = pass;
        user.updatedAt = new Date();
        await user.save();

        return res.status(200).json({ message: "password reset successfully" });

    } catch (error) {
        return handleError(error, res);
    }
}

