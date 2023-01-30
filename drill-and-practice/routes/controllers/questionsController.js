import * as questionsService from "../../services/questionsService.js";
import { getTopicById } from "../../services/topicService.js";
import { validateData } from "../../validation/validation.js";

const listQuestions = async ({render, params}) => {
    const data = {
        id: params.id,
        questions: await questionsService.listQuestions(params.id),
        question: "",
        topic: await getTopicById(params.id),
        errors: null,
    };
    return render("topic.eta", data);
};

const addQuestion = async ({request, render, response, params, state}) => {
    const body = request.body({type: "form"});
    const form_params = await body.value;
    const question_text = form_params.get("question_text");
    const user = await state.session.get("user");

    const data = {
        id: params.id,
        questions: await questionsService.listQuestions(params.id),
        question: question_text,
        topic: await getTopicById(params.id),
        errors: null,
    };

    // Checking if question has already been added
    const questionsWithSameText = await questionsService.getQuestion(question_text, data.id);
    if (questionsWithSameText.length > 0) {
        data.errors = { question: { isRequired: "question is already added"}};
        return render("topic.eta", data);
    }
    // Checking if question is at least 1 character long (Validasaur minLength(1) doesn't work for some reason)
    if (!(question_text.length > 0)) {
        data.errors = { question: { isRequired: "question has to be at least 1 character long"}};
        return render("topic.eta", data);
    }

    // Validating the question
    const [passes, errors] = await validateData(data);

    if (!passes) {
        data.errors = errors;
        return render("topic.eta", data);
    } else {
        await questionsService.addQuestion(user.id, data.id, question_text);
        return response.redirect(`/topics/${data.id}`);
    }
};

const listQuestionOptions = async ({render, params}) => {
    const data = {
        t_id: params.t_id,
        q_id: params.q_id,
        question_text: await questionsService.getQuestionById(params.q_id),
        option: "",
        options: await questionsService.listAnswerOptions(params.q_id),
        is_correct: null,
        errors: null,
    };
    return render("question.eta", data);
};

const addQuestionOption = async ({request, render, params, response}) => {
    const body = request.body({type: "form"});
    const form_params = await body.value;
    //const question_text = await questionsService.getQuestionById(params.q_id);

    const data = {
        t_id: params.t_id,
        q_id: params.q_id,
        question_text: await questionsService.getQuestionById(params.q_id),
        option: form_params.get("option_text"),
        options: await questionsService.listAnswerOptions(params.q_id),
        is_correct: form_params.get("is_correct"),
        errors: null,
    };


    // Checking if option has already been added
    const optionsWithSameText = await questionsService.getOption(data.option, data.q_id);
    if (optionsWithSameText.length > 0) {
        data.errors = { option: { isRequired: "option is already added"}};
        return render("question.eta", data);
    }
    // Checking if question is at least 1 character long (Validasaur minLength(1) doesn't work for some reason)
    if (!(data.option.length > 0)) {
        data.errors = { option: { isRequired: "option has to be at least 1 character long"}};

        return render("question.eta", data);
    }

    // Validating the question
    const [passes, errors] = await validateData(data);

    if (!passes) {
        data.errors = errors;
        return render("question.eta", data);
    } else {
        if (data.is_correct) {
            await questionsService.addAnswerOptionTrue(data.q_id, data.option, data.is_correct);
        } else {
            await questionsService.addAnswerOption(data.q_id, data.option);
        }
        return response.redirect(`/topics/${data.t_id}/questions/${data.q_id}`);
    }
};

const deleteOption = async ({params, response}) => {
    await questionsService.deleteOption(params.o_id);
    return response.redirect(`/topics/${params.t_id}/questions/${params.q_id}`);
};

const deleteQuestion = async ({params, response}) => {
    await questionsService.deleteQuestion(params.q_id);
    return response.redirect(`/topics/${params.t_id}`);
};

export { listQuestions, addQuestion, listQuestionOptions, addQuestionOption, deleteOption, deleteQuestion }