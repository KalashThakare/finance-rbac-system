import express from "express";
import dotenv from "dotenv";
import { initModels } from "./database/index.js";

dotenv.config();   

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

initModels();

app.get("/", (req, res) => {
    res.send("Server testing .........")
});

export default app;