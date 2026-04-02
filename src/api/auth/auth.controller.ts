import { Request, Response } from "express";
import { User } from "../users/users.model.js";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.user = user;

        return res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = (req: Request, res: Response) => {

    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.clearCookie("session");
        return res.status(200).json({ message: "Logout successfully" });
    })

}