// getState is used to get the value of a state path
// setState is used to set the value of a state path
import { getState, setState } from "statezero";
import { setEmptyState } from "./helpers";
import { getUserCovers, defaultCover } from "./cover";

export const readCookie = () => {
  const url = "/users/check-session";

  fetch(url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      if (json && json.currentUser) {
        setState("currentUser", json.currentUser);
        setState("userID", json.userID);
        getUserCovers();
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const updateLoginForm = field => {
  const { name, value } = field;
  setState(`loginForm.${name}`, value);
};

export const login = () => {
  setState("loginClick", true);

  // Create our request constructor with all the parameters we need
  const request = new Request("/users/login", {
    method: "post",
    body: JSON.stringify(getState("loginForm")),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  // Send the request with fetch()
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        setState("failedLogin", true);
        setTimeout(function() {
          setState("failedLogin", false);
        }, 3250);

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
        setTimeout(function() {
          setState("loginError", false);
        }, 3250);
      }

      setState("loginClick", false);
      console.log(error);
    });
};

export const register = event => {
  // Create our request constructor with all the parameters we need
  const request = new Request("/users/register", {
    method: "post",
    body: JSON.stringify(getState("loginForm")),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      if (json !== undefined) {
        // Successful registration
        // Create the sample page
        defaultCover(json._id);
        setState("registered", true);
        setTimeout(function() {
          setState("registered", false);
        }, 3250);
        login();
      } else if (getState("loginForm").password.length < 6) {
        // Short password
        setState("passwordShort", true);
        setTimeout(function() {
          setState("passwordShort", false);
        }, 3250);
      } else {
        // Invalid username
        setState("invalidUsername", true);
        setTimeout(function() {
          setState("invalidUsername", false);
        }, 3250);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const logout = () => {
  const url = "/users/logout";

  fetch(url)
    .then(res => {
      setEmptyState();
    })
    .catch(error => {
      console.log(error);
    });
};
