import * as reglogService from "../../services/reglogService.js";
import { bcrypt } from "../../deps.js";
import { validateData } from "../../validation/validation.js";

const addUser = async ({request, response, render}) => {
    const body = request.body({type: "form"});
    const params = await body.value;
    const email = params.get("email");
    const password = params.get("password");

    const data = {
        email: email,
        password: password,
        errors: null,
    };

    // Checking if user is already registered
    const usersWithThisEmail = await reglogService.getUser(email);
    if (usersWithThisEmail.length > 0) {
        data.errors = { email: { isRequired: "email is already registered"}};
        return render("register.eta", data);
    }

    // Validating data before registering user
    const [passes, errors] = await validateData(data);

    if (!passes) {
        data.errors = errors;
        render("register.eta", data);
    } else {
        const passwordHash = await bcrypt.hash(password);
        await reglogService.addUser(email, passwordHash);
        response.redirect("/auth/login");
    }
};

const showRegistration = async ({render}) => {
    return render("register.eta", {email: "", password: ""});
};

const showLogin = async ({render}) => {
    return render("login.eta", {error: "", email: "", password: ""});
};

const loginUser = async ({request, response, render, state}) => {
    const body = request.body({type: "form"});
    const params = await body.value;
    const password = params.get("password");
    const email = params.get("email");

    // Checking if credentials match with a user in the database
    const res = await reglogService.getUser(email);
    const user = res[0];
    if (!user) {
        return render("login.eta", {error: "Email is not registered", email: email, password: password});
    }

    // Trying to log in user
    const comp = await bcrypt.compare(password, user.password);
    if (comp) { // Success

        // Checking if user is an admin
        if (user.admin) {
            await state.session.set("admin", true);
        }
        await state.session.set("authenticated", true);
        await state.session.set("user", user);
        response.redirect("/topics");
    } else {
        return render("login.eta", {error: "Incorrect password", email: email, password: password});
    }
};

const logoutUser = async ({state, response}) => {
    await state.session.set("authenticated", false);
    await state.session.set("admin", false);
    await state.session.set("user", {});
    return response.redirect("/");
};

export { addUser, showRegistration, loginUser, showLogin, logoutUser }