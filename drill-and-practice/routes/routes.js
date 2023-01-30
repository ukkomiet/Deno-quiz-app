import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as reglogController from "./controllers/reglogController.js";
import * as questionsController from "./controllers/questionsController.js"
import * as quizController from "./controllers/quizController.js"

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.listTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);

router.get("/topics/:id", questionsController.listQuestions);
router.post("/topics/:id/questions", questionsController.addQuestion);
router.post("/topics/:t_id/questions/:q_id/delete", questionsController.deleteQuestion);

router.get("/topics/:t_id/questions/:q_id", questionsController.listQuestionOptions);
router.post("/topics/:t_id/questions/:q_id/options", questionsController.addQuestionOption);
router.post("/topics/:t_id/questions/:q_id/options/:o_id/delete", questionsController.deleteOption);

router.get("/quiz", quizController.listQuizTopics);
router.get("/quiz/:t_id", quizController.randomQuestion);
router.get("/quiz/:t_id/questions/:q_id", quizController.showQuestion);
router.post("/quiz/:t_id/questions/:q_id/options/:o_id", quizController.addAnswer);
router.get("/quiz/:t_id/questions/:q_id/correct", quizController.showCorrect);
router.get("/quiz/:t_id/questions/:q_id/incorrect", quizController.showIncorrect);

router.get("/auth/register", reglogController.showRegistration);
router.post("/auth/register", reglogController.addUser);
router.get("/auth/login", reglogController.showLogin);
router.post("/auth/login", reglogController.loginUser);
router.post("/auth/logout", reglogController.logoutUser);

router.get("/api/questions/random", quizController.apiRandomQuestion);
router.post("/api/questions/answer", quizController.apiAnswer);


export { router };
