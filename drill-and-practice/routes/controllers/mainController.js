import * as statsService from "../../services/statsService.js";

const showMain = async ({ render, state }) => {
  const topicsNumber = await statsService.getTopicsNumber();
  const questionsNumber = await statsService.getQuestionsNumber();
  const userAnswersNumber = await statsService.getUserAnswersNumber();

  render("main.eta", { authenticated: await state.session.get("authenticated"),
                      user: await state.session.get("user"),
                      tNumber: topicsNumber,
                      qNumber: questionsNumber,
                      uNumber: userAnswersNumber});
};

export { showMain };
