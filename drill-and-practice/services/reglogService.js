import { executeQuery } from "../database/database.js";

const addUser = async (email, passwordCrypted) => {
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, passwordCrypted);
};

const getUser = async (email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = ($1);", email);
    return res.rows;
};

export { addUser, getUser }