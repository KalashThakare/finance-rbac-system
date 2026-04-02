import { Request, Response } from "express";
import { User } from "./users.model.js";
import { CreateUserBody, UserRole, UserStatus } from "../../types/user.types.js";

export const createUser = async (req: Request, res: Response) => {
    try {

        const body: CreateUserBody = req.body;
        if (!body.name || !body.email || !body.password || !body.role) {
            return res.status(400).json({ message: "all fields are required" });
        }

        //Lower case the role and status
        const role = body.role.toLowerCase() as UserRole;
        const status = (body.status || UserStatus.ACTIVE).toLowerCase() as UserStatus;

        if (!Object.values(UserRole).includes(role)) {
            return res.status(400).json({ message: "invalid role" });
        }

        if (!Object.values(UserStatus).includes(status)) {
            return res.status(400).json({ message: "invalid status" });
        }

        const user = await User.create({
            name: body.name,
            email: body.email,
            password: body.password,
            role,
            status,
            createdBy: req.user?.id as string  
        });

        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}