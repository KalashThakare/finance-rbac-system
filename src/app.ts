import express from "express";
import dotenv from "dotenv";
import { initModels } from "./database/index.js";
import session from "express-session";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
    }
}));

initModels();

app.get("/", (req, res) => {
    res.send("Server testing .........")
});

export default app;