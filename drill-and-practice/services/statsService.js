import { executeQuery } from "../database/database.js";


const getTopicsNumber = async () => {
    const res = await executeQuery("SELECT * FROM topics;");
    return res.rows.length;
};

const getQuestionsNumber = async () => {
    const res = await executeQuery("SELECT * FROM questions;");
    return res.rows.length;
};

const getUserAnswersNumber = async () => {
    const res = await executeQuery("SELECT * FROM question_answers;");
    return res.rows.length;
};

export { getQuestionsNumber, getTopicsNumber, getUserAnswersNumber }