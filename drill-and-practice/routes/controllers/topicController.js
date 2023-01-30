import * as topicService from "../../services/topicService.js";
import { validateData } from "../../validation/validation.js";

const listTopics = async ({render, state}) => {
    render("topics.eta", { topics: await topicService.listTopics(), topic: "", admin: await state.session.get("admin") });
};

const addTopic = async ({request, response, render, state}) => {

    const body = request.body({type: "form"});
    const params = await body.value;
    const topic_name = params.get("name");
    const user = await state.session.get("user");

    const data = {
        topics: await topicService.listTopics(),
        topic: topic_name,
        errors: null,
        admin: await state.session.get("admin"),
    };

    // Checking if user is admin
    if (!data.admin) {
        return response.redirect("/topics");
    };

    // Checking if topic is already added
    const topicsWithSameName = await topicService.getTopic(topic_name);
    if (topicsWithSameName.length > 0) {
        data.errors = { topic: { isRequired: "topic is already added"}};
        return render("topics.eta", data);
    }
    
    // Checking if topic is at least 1 character long (Validasaur minLength(1) doesn't work for some reason)
    if (!(topic_name.length > 0)) {
        data.errors = { topic: { isRequired: "topic has to be at least 1 character long"}};
        return render("topics.eta", data);
    }

    // Validating topic
    const [passes, errors] = await validateData(data);
    if (!passes) {
        data.errors = errors;
        return render("topics.eta", data);
    } else {
        await topicService.addTopic(user.id, topic_name);
        return response.redirect("/topics");
    }
};

const deleteTopic = async ({response, params, state}) => {

    // Checking if user is admin
    if (!(await state.session.get("admin"))) {
        return response.redirect("/topics");
    };

    const topicID = params.id;
    await topicService.deleteTopicComplete(topicID);
    return response.redirect("/topics");
};

export { listTopics, addTopic, deleteTopic }