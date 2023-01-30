import { superoak } from "../deps.js";
import { app } from "../app.js";


Deno.test({
  name: "GET request to /api/questions/random should return a JSON document",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

  // In my test dataset the question with id=12 had two options: the correct one (id=16) and the wrong one (id=17)
  // Note that these values will change in the end product since it doesn't contain my dataset
  
  Deno.test("POST request to /api/questions/answer with a valid answer should return a JSON document", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({questionId: 12, optionId: 16})
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  });

  Deno.test("POST request to /api/questions/answer with a correct answer should return a JSON document with attribute 'correct: true'", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({questionId: 12, optionId: 16})
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
      .expect({correct: true});
  });

  Deno.test("POST request to /api/questions/answer with a false answer should return a JSON document with attribute 'correct: false'", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({questionId: 12, optionId: 17})
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
      .expect({correct: false});
  });