import { executeQuery } from "../database/database.js";

const deleteQuestion = async (questionID) => {
    await executeQuery("DELETE FROM question_answers WHERE question_id = ($1);", questionID);
    await executeQuery("DELETE FROM questions WHERE id = ($1);", questionID);
};

const deleteOption = async (optionID) => {
    await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id = ($1);", optionID);
    await executeQuery("DELETE FROM question_answer_options WHERE id = ($1);", optionID);
};

const addQuestion = async (userID, topicID, text) => {
    await executeQuery("INSERT INTO questions (user_id, topic_id, question_text) VALUES ($1, $2, $3);", userID, topicID, text);
};

const listQuestions = async (topicID) => {
    const res = await executeQuery("SELECT * FROM questions WHERE topic_id = ($1);", topicID);
    return res.rows;
}

const addAnswerOption = async (questionID, text) => {
    await executeQuery("INSERT INTO question_answer_options (question_id, option_text) VALUES ($1, $2);", questionID, text);
};

const addAnswerOptionTrue = async (questionID, text, is_correct) => {
    await executeQuery("INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1, $2, $3);", questionID, text, is_correct);
};

const listAnswerOptions = async (questionID) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = ($1);", questionID);
    return res.rows;
};

const getQuestion = async (text, topicID) => {
    const res = await executeQuery("SELECT * FROM questions WHERE question_text = ($1) AND topic_id = ($2);", text, topicID);
    return res.rows;
};

const getQuestionById = async (id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE id = ($1);", id);
    return res.rows[0].question_text;
};

const getOption = async (text, questionID) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE option_text = ($1) AND question_id = ($2);", text, questionID);
    return res.rows;
};

export { addQuestion, addAnswerOption, addAnswerOptionTrue, listAnswerOptions, listQuestions, getOption, getQuestion, getQuestionById, deleteOption, deleteQuestion }