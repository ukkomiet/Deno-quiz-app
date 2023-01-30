import { executeQuery } from "../database/database.js";

const listTopics = async () => {
    const res = await executeQuery("SELECT * FROM topics ORDER BY name;");
    return res.rows;
};

const addTopic = async (userID, name) => {
    await executeQuery("INSERT INTO topics (user_id, name) VALUES ($1, $2);", userID, name);
};

const deleteTopicComplete = async (topicID) => {
    const questionsRes = await executeQuery("SELECT (id) FROM questions WHERE topic_id = ($1);", topicID);
    const questions = questionsRes.rows;
    // delete everything that has this question_id
    for await (const q of questions) {
        await executeQuery("DELETE FROM question_answers WHERE question_id = ($1);", q.id);
        await executeQuery("DELETE FROM question_answer_options WHERE question_id = ($1);", q.id);
    };

    await executeQuery("DELETE FROM questions WHERE topic_id = ($1);", topicID);
    await executeQuery("DELETE FROM topics WHERE id = ($1);", topicID);
};

const getTopic = async (topic_name) => {
    const res = await executeQuery("SELECT * FROM topics WHERE name = ($1);", topic_name);
    return res.rows;
}; 

const getTopicById = async (id) => {
    const res = await executeQuery("SELECT * FROM topics WHERE id = ($1);", id);
    return res.rows[0].name;
};


export { listTopics, addTopic, deleteTopicComplete, getTopic, getTopicById }