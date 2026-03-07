import { getState, setState } from "../store";
import { setEmptyState, autoHide } from "./helpers";
import { getUserCovers, defaultCover } from "./cover";

export const readCookie = () => {
  fetch("/users/check-session")
    .then(res => {
      if (res.status === 200) return res.json();
    })
    .then(json => {
      if (json?.currentUser) {
        setState("currentUser", json.currentUser);
        setState("userID", json.userID);
        getUserCovers();
      }
    })
    .catch(() => {});
};

export const updateLoginForm = field => {
  const { name, value } = field;
  setState(`loginForm.${name}`, value);
};

export const login = () => {
  setState("loginClick", true);

  const request = new Request("/users/login", {
    method: "post",
    body: JSON.stringify(getState("loginForm")),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        setState("failedLogin", true);
        autoHide("failedLogin");
        setState("loginClick", false);
      }
    })
    .then(json => {
      if (json.currentUser !== undefined) {
        setState("userID", json.userID);
        setState("currentUser", json.currentUser);
        getUserCovers();
        setState("loginClick", false);
      }
    })
    .catch(error => {
      if (getState("failedLogin") !== true) {
        setState("loginError", true);
        autoHide("loginError");
      }
      setState("loginClick", false);
      console.log(error);
    });
};

export const register = event => {
  const request = new Request("/users/register", {
    method: "post",
    body: JSON.stringify(getState("loginForm")),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      if (json !== undefined) {
        defaultCover(json._id);
        setState("registered", true);
        autoHide("registered");
        login();
      } else if (getState("loginForm").password.length < 6) {
        setState("passwordShort", true);
        autoHide("passwordShort");
      } else {
        setState("invalidUsername", true);
        autoHide("invalidUsername");
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const logout = () => {
  fetch("/users/logout")
    .then(() => {
      document.title = "Page Forge";
      window.history.replaceState({}, "", "/dashboard");
      setEmptyState();
    })
    .catch(error => {
      console.log(error);
    });
};
