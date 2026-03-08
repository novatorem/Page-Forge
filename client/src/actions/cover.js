import { getState, setState } from "../store";
import { autoHide } from "./helpers";

export const newCover = (title, data = "") => {
  const request = new Request("/covers/new", {
    method: "POST",
    body: JSON.stringify({
      owner: getState("userID"),
      title,
      data
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(async res => {
      if (res.status === 200) {
        setState("coverSuccess", true);
        autoHide("coverSuccess");
        getUserCovers();
      } else {
        const body = await res.json().catch(() => ({}));
        setState("coverError", body.error || "Failed to create page.");
        autoHide("coverError");
      }
    })
    .catch(error => {
      console.log(error);
      setState("coverError", "Failed to create page.");
      autoHide("coverError");
    });
};

export const getUserCovers = () => {
  const url = "/covers/" + getState("userID");

  fetch(url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.error("Failed to load covers:", res.status);
      }
    })
    .then(json => {
      setState("userCovers", json);
    })
    .catch(error => {
      console.log(error);
    });
};

export const saveUserCover = (silent = false) => {
  const cover = getState("cover");
  const url = "/covers/" + cover._id;

  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify({ data: cover.data }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        if (!silent) {
          setState("saveSuccess", true);
          autoHide("saveSuccess");
        }
        return res.json();
      } else {
        console.log(res);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const duplicateUserCover = cover => {
  return fetch("/covers/new", {
    method: "POST",
    body: JSON.stringify({
      owner: cover.owner,
      title: cover.title,
      data: cover.data
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(async res => {
      if (res.status === 200) {
        getUserCovers();
      } else {
        const body = await res.json().catch(() => ({}));
        setState("coverError", body.error || "Failed to duplicate page.");
        autoHide("coverError");
      }
    })
    .catch(error => console.log(error));
};

export const renameUserCover = (coverId, newTitle) => {
  return fetch(`/covers/${coverId}`, {
    method: "PATCH",
    body: JSON.stringify({ title: newTitle }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  }).catch(error => console.log(error));
};

export const deleteUserCover = () => {
  const cover = getState("cover");
  const url = "/covers/" + cover._id;

  const request = new Request(url, {
    method: "DELETE",
    body: JSON.stringify({ data: cover.data }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res => {
      if (res.status === 200) {
        setState("deleteSuccess", true);
        autoHide("deleteSuccess");
        getUserCovers();
        return res.json();
      } else {
        console.log(res);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

