import { User } from "./users.model.js";
import { UserRole, UserStatus, UserResponse } from "../../types/user.types.js";

// Helper

const formatUser = (user: User): UserResponse => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdBy: user.createdBy,
    createdAt: user.createdAt,
});

// Services 

export const checkUserExists = async (email: string): Promise<boolean> => {

    const count = await User.count({ where: { email } });

    return count > 0;

};

export const createUserService = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    createdBy: string;
}): Promise<UserResponse> => {

    const user = await User.create(data);

    return formatUser(user);

};

export const getUsersService = async (): Promise<UserResponse[]> => {

    const users = await User.findAll();

    return users.map(formatUser);

};


export const getUserByIdService = async (id: string): Promise<UserResponse> => {

    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found:404");
    
    return formatUser(user);

};

export const updateStatusService = async (id: string, status: UserStatus): Promise<UserResponse> => {

    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found:404");

    user.status = status;
    await user.save();

    return formatUser(user);
};

export const updateRoleService = async (id: string, role: UserRole): Promise<UserResponse> => {

    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found:404");

    user.role = role;
    await user.save();

    return formatUser(user);
};

export const resetPasswordService = async (id: string, hashedPassword: string): Promise<void> => {

    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found:404");

    user.password = hashedPassword;

    await user.save();
};