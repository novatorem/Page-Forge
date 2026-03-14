import { getState, setState } from "../store";
import { autoHide } from "./helpers";

export const newPage = (title, data = "") => {
  const request = new Request("/pages/new", {
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
        setState("pageSuccess", true);
        autoHide("pageSuccess");
        getUserPages();
      } else {
        const body = await res.json().catch(() => ({}));
        setState("pageError", body.error || "Failed to create page.");
        autoHide("pageError");
      }
    })
    .catch(error => {
      console.error(error);
      setState("pageError", "Failed to create page.");
      autoHide("pageError");
    });
};

export const getUserPages = () => {
  const url = "/pages/" + getState("userID");

  fetch(url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.error("Failed to load pages:", res.status);
      }
    })
    .then(json => {
      setState("userPages", json);
    })
    .catch(error => {
      console.error(error);
    });
};

export const saveUserPage = (silent = false) => {
  const page = getState("page");
  const url = "/pages/" + page._id;

  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify({ data: page.data }),
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
        console.error("Save failed:", res.status);
      }
    })
    .catch(error => {
      console.error(error);
    });
};

export const duplicateUserPage = page => {
  return fetch("/pages/new", {
    method: "POST",
    body: JSON.stringify({
      owner: page.owner,
      title: page.title,
      data: page.data
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(async res => {
      if (res.status === 200) {
        getUserPages();
      } else {
        const body = await res.json().catch(() => ({}));
        setState("pageError", body.error || "Failed to duplicate page.");
        autoHide("pageError");
      }
    })
    .catch(error => console.error(error));
};

export const renameUserPage = (pageId, newTitle) => {
  return fetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ title: newTitle }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  }).catch(error => console.error(error));
};

export const deleteUserPage = () => {
  const page = getState("page");
  const url = "/pages/" + page._id;

  const request = new Request(url, {
    method: "DELETE",
    body: JSON.stringify({ data: page.data }),
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
        getUserPages();
        return res.json();
      } else {
        console.error("Delete failed:", res.status);
      }
    })
    .catch(error => {
      console.error(error);
    });
};
