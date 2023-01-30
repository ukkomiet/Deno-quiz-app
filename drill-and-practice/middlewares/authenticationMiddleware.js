import { session } from "../app.js";

const authenticationMiddleware = async({request, response, state}, next) => {
    if (request.url.pathname.startsWith('/topics') || request.url.pathname.startsWith('/quiz')) {
      if (session
          && await state.session.get('authenticated')) {
        await next();
      } else {
        response.redirect("/auth/login");
      }
    } else {
      await next();
    }
  };

  export { authenticationMiddleware }