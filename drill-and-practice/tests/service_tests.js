import { assertEquals } from "../deps.js";
import * as topicService from "../services/topicService.js";
import * as questionsService from "../services/questionsService.js";
import * as quizService from "../services/quizService.js";
import * as statsService from "../services/statsService.js";


// Please note that these tests won't work in the end product since the database won't contain my test dataset anymore

Deno.test({
    name: "getTopic should return an array of one object, and the topic's name should be 'test'",
    fn: async () => {
        const topicArray = await topicService.getTopic("test");
        assertEquals(topicArray[0].name, "test");
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

  Deno.test("getTopicById should return 'test' with id=30", async () => {
    const topic_text = await topicService.getTopicById(30);
    assertEquals(topic_text, "test");
  });

  Deno.test("getQuestion should return an array of one object", async () => {
    const questionArray = await questionsService.getQuestion("test_q", 30);
    assertEquals(questionArray.length, 1);
  });

  Deno.test("getQuestionById should return 'test_q' with id=12", async () => {
    const question_text = await questionsService.getQuestionById(12);
    assertEquals(question_text, "test_q");
  });

  Deno.test("checkAnswerCorrectness should return 'true' with id=16", async () => {
    const answer_correctness = await quizService.checkAnswerCorrectness(16);
    assertEquals(answer_correctness, true);
  });

  Deno.test("checkAnswerCorrectness should return 'false' with id=17", async () => {
    assertEquals(await quizService.checkAnswerCorrectness(17), false);
  });

  Deno.test("getCorrectAnswer should return 'option true' with id=12", async () => {
    assertEquals(await quizService.getCorrectAnswer(12), "option true");
  });

  Deno.test("getQuestionsNumber should return 4", async () => {
    assertEquals(await statsService.getQuestionsNumber(), 4);
  });

