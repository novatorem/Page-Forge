import { setState } from "../store";

export const autoHide = (key, ms = 3250) => {
  setTimeout(() => setState(key, false), ms);
};

export const setEmptyState = () => {
  setState("currentUser", null);
  setState("loginForm", { username: "", password: "" });
  setState("userID", null);

  setState("loginClick", false);
  setState("loginError", false);
  setState("failedLogin", false);
  setState("registered", false);
  setState("passwordShort", false);
  setState("invalidUsername", false);

  setState("coverTitle", null);
  setState("coverShort", false);
  setState("coverSuccess", false);

  setState("cover", null);
  setState("info", false);
  setState("deleteC", false);
  setState("userCovers", null);
  setState("saveSuccess", false);
  setState("deleteSuccess", false);

  setState("tryCover", {
    data: `Hello, and welcome to Page Forge! Write your template on the left - the interactive version appears on the right. Fill in the fields, then copy or print the result.

Text inputs use {_}, like: Hello {_},

Dropdowns use {this/that/or anything else}, like: I'll meet up with you {immediately/next week}.

Date pickers use {date} and pre-fill with today's date.

Number inputs use {#}, like: I have {#} instances that can be deployed.

Optional text uses {?:sentence to include or omit} - click the checkbox to toggle it in the output.

Paragraph selectors use {*} to pick from named blocks defined at the end of the template.

{Strong Closer|I can be sure that this will save you a lot of time and effort.}
{Brief Closer|Thank you for your time and consideration. I look forward to hearing from you.}`
  });
};
