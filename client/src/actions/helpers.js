import { setState } from "../store";
import useAppStore from "../store";

export const autoHide = (key, ms = 3250) => {
  setTimeout(() => setState(key, false), ms);
};

export const setEmptyState = () => {
  useAppStore.setState({
    currentUser: null,
    loginForm: { username: "", password: "" },
    userID: null,

    loginClick: false,
    loginError: false,
    failedLogin: false,
    registered: false,
    passwordShort: false,
    invalidUsername: false,

    pageTitle: null,
    pageShort: false,
    pageSuccess: false,

    page: null,
    info: false,
    deleteC: false,
    userPages: null,
    saveSuccess: false,
    deleteSuccess: false,

    tryPage: {
      data: `Hello, and welcome to Page Forge! Write your template on the left - the interactive version appears on the right. Fill in the fields, then copy or print the result.

Text inputs use {_}, like: Hello {_},

Dropdowns use {this/that/or anything else}, like: I'll meet up with you {immediately/next week}.

Date pickers use {date} and pre-fill with today's date.

Number inputs use {#}, like: I have {#} instances that can be deployed.

Optional text uses {?:sentence to include or omit} - click the checkbox to toggle it in the output.

Paragraph selectors use {*} to pick from named blocks defined at the end of the template.

{Strong Closer|I can be sure that this will save you a lot of time and effort.}
{Brief Closer|Thank you for your time and consideration. I look forward to hearing from you.}`
    }
  });
};
