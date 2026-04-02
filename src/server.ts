import app from "./app.js";
import dotenv from "dotenv";
import sequelize, { connectDB } from "./config/db.js";
import { initModels, syncModels } from "./database/index.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

async function startServer() {

    await connectDB();
    initModels();


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    syncModels().catch((err) => {
        console.error("Model sync failed:", err);
    });

    process.on("SIGINT", async () => {
        console.log("Server shutting down...");
        await sequelize.close();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        console.log("Server shutting down...");
        await sequelize.close();
        process.exit(0);
    });
}

startServer();