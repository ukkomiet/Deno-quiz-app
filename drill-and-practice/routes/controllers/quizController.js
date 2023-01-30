import * as quizService from "../../services/quizService.js";
import { listTopics, getTopicById } from "../../services/topicService.js"
import { getQuestionById, listAnswerOptions } from "../../services/questionsService.js";
import { getQuestionsNumber } from "../../services/statsService.js";

const listQuizTopics = async ({render}) => {
    return render("quiz_topics.eta", { topics: await listTopics()});
};

const randomQuestion = async ({params, response, render}) => {
    const questions = await quizService.getRandomQuestionFromTopic(params.t_id);

    // Checking if topic has questions
    if (questions.length > 0) {
        return response.redirect(`/quiz/${params.t_id}/questions/${questions[0].id}`);
    } else {
        return render("quiz_topics.eta", { topics: await listTopics(), error: "error", topic: await getTopicById(params.t_id)});
    }
};

const showQuestion = async ({params, render}) => {

    const data = {
        t_id: params.t_id,
        q_id: params.q_id,
        topic: await getTopicById(params.t_id),
        question: await getQuestionById(params.q_id),
        options: await listAnswerOptions(params.q_id),
    };
    return render("quiz.eta", data);
};

const addAnswer = async ({params, response, state}) => {
    const user = await state.session.get("user");
    await quizService.storeAnswer(user.id, params.q_id, params.o_id);
    const result = await quizService.checkAnswerCorrectness(params.o_id);

    //Checking if answer was correct and redirecting
    if (result) {
        return response.redirect(`/quiz/${params.t_id}/questions/${params.q_id}/correct`);
    } else {
        return response.redirect(`/quiz/${params.t_id}/questions/${params.q_id}/incorrect`);
    }
};

const showCorrect = async ({params, render}) => {
    return render("correct.eta", {t_id: params.t_id});
};

const showIncorrect = async ({params, render}) => {
    const data = {
        answer: await quizService.getCorrectAnswer(params.q_id),
        t_id: params.t_id,
    };
    return render("incorrect.eta", data);
};

const apiRandomQuestion = async ({response}) => {

    // Checking if there are any questions
    if (await getQuestionsNumber() > 0) {

        // Building the response JSON object
        const question = await quizService.getRandomQuestion();
        const options = await listAnswerOptions(question.id);
        let answerOptions = [];

        for (const option of options) {
            answerOptions.push({
                optionId: option.id,
                optionText: option.option_text,
            });
        };

        const data = {
            questionId: question.id,
            questionText: question.question_text,
            answerOptions: answerOptions,
        };

        response.body = data;

    } else {
        response.body = {};
    }
};

const apiAnswer = async ({response, request}) => {
    const body = request.body({ type: "json" });
    const content = await body.value;
    const o_id = content.optionId;
    const result = await quizService.checkAnswerCorrectness(o_id);
    
    response.body = {correct: result};
};

export { listQuizTopics, randomQuestion, showQuestion, addAnswer, showCorrect, showIncorrect, apiRandomQuestion, apiAnswer }