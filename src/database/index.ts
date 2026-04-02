import sequelize from "../config/db.js";
import { defineUserModel } from "../api/users/users.model.js";

export const initModels = () => {
    defineUserModel(sequelize);
};

export const syncModels = async (): Promise<void> => {
    const models = Object.values(sequelize.models);

    await Promise.all(
        models.map((model) =>
            model.sync({ alter: true }).then(() =>
                console.log(`${model.name} synced.`)
            )
        )
    );
};

export { sequelize };