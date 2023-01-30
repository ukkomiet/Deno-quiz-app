import { executeQuery } from "../database/database.js";

const getRandomQuestionFromTopic = async (topicID) => {
    const res = await executeQuery("SELECT * FROM questions WHERE topic_id = ($1) ORDER BY RANDOM();", topicID);
    return res.rows;
};

const storeAnswer = async (userID, questionID, optionID) => {
    await executeQuery("INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES ($1, $2, $3);", userID, questionID, optionID);
};

const checkAnswerCorrectness = async (optionID) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE id = ($1);", optionID);
    return res.rows[0].is_correct;
};

const getCorrectAnswer = async (questionID) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = ($1) AND is_correct = TRUE;", questionID);
    if (res.rows.length > 0) {
        return res.rows[0].option_text;
    } else {
        return "There was no correct option...";
    }
};

const getRandomQuestion = async() => {
    const res = await executeQuery("SELECT * FROM questions ORDER BY RANDOM();");
    return res.rows[0];
};

export { getRandomQuestionFromTopic, storeAnswer, checkAnswerCorrectness, getCorrectAnswer, getRandomQuestion }