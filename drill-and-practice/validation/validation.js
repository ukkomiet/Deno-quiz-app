import { validasaur } from "../deps.js";

const validationRules = {
    email: [validasaur.isEmail, validasaur.maxLength(255)],
    topic: [validasaur.minLength(1), validasaur.maxLength(255)],
    password: [validasaur.minLength(4), validasaur.maxLength(60)],
    question: [validasaur.minLength(1)],
    option: [validasaur.minLength(1)],
};

const validateData = async (data) => {
    const [passes, errors] = await validasaur.validate(data, validationRules);
    return [passes, errors];
};

export { validateData }