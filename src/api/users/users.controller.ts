import { Request, Response } from "express";
import { UserRole, UserStatus, UpdatePasswordBody, UpdateRoleBody, UpdateStatusBody, CreateUserBody } from "../../types/user.types.js";
import { handleError } from "../../utils/errorHandler.js";
import { AppError } from "../../utils/errors.js";
import bcrypt from "bcrypt";
import { checkUserExists, createUserService, getUserByIdService, getUsersService, resetPasswordService, updateRoleService, updateStatusService } from "./users.service.js";

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        const userId = req.user!.id;

        const body: CreateUserBody = req.body;

        const exists = await checkUserExists(body.email);
        if (exists) throw new AppError("User already exists", 409);

        const hashedPassword = await bcrypt.hash(body.password, 12);

        const user = await createUserService({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role as UserRole,
            status: (body.status || UserStatus.ACTIVE) as UserStatus,
            createdBy: userId,
        });

        return res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        return handleError(error, res);
    }
};

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {

        const users = await getUsersService();

        return res.status(200).json({ message: "Users fetched successfully", users });

    } catch (error) {
        return handleError(error, res);
    }
};

export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.params.id as string;
        const body: UpdateStatusBody = req.body;

        const user = await updateStatusService(id, body.status);

        return res.status(200).json({ message: "User status updated successfully", user });

    } catch (error) {
        return handleError(error, res);
    }
};

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.params.id as string;
        const body: UpdateRoleBody = req.body;

        const user = await updateRoleService(id, body.role);

        return res.status(200).json({ message: "User role updated successfully", user });

    } catch (error) {
        return handleError(error, res);
    }
};

export const getMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {

        const userId = req.user!.id;

        const user = await getUserByIdService(userId);

        return res.status(200).json({ message: "Profile fetched successfully", user });

    } catch (error) {
        return handleError(error, res);
    }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {

        const id = req.params.id as string
        const user = await getUserByIdService(id);

        return res.status(200).json({ message: "User fetched successfully", user });

    } catch (error) {
        return handleError(error, res);
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const userId = req.user!.id;
        
        const body: UpdatePasswordBody = req.body;
        const hashedPassword = await bcrypt.hash(body.password, 12);

        await resetPasswordService(userId, hashedPassword);

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return handleError(error, res);
    }
};