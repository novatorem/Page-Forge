// getState is used to get the value of a state path
// setState is used to set the value of a state path
import { getState, setState } from "statezero";

export const newCover = title => {
  const url = "/covers/new";
  
  let userCover = JSON.stringify({
      owner: getState("userID"),
      title: title,
      data: ""
    })

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "post",
    body: userCover,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        setState("coverSuccess", true);
        setTimeout(function() {
          setState("coverSuccess", false);
        }, 3250);
        getUserCovers();
        
        setState("cover", userCover);
        
        return res.json();
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const getUserCovers = () => {
  // the URL for the request
  const url = "/covers/" + getState("userID");

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get anything");
      }
    })
    .then(json => {
      // the resolved promise with the JSON body
      setState("userCovers", json);
    })
    .catch(error => {
      console.log(error);
    });
};

export const saveUserCover = async () => {
  // Wait 0.5 seconds to make sure the state is updated
  await new Promise(resolve => setTimeout(resolve, 500));
  const cover = getState("cover");

  // Oddly, it's _id for some, id for others
  let url;
  if (cover._id !== undefined) {
    url = "/covers/" + cover._id;
  } else {
    url = "/covers/" + cover.id;
  }

  const request = new Request(url, {
    method: "PATCH",
    body: JSON.stringify({
      data: cover.data
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        setState("saveSuccess", true);
        setTimeout(function() {
          setState("saveSuccess", false);
        }, 3250);
        return res.json();
      } else {
        console.log(res);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteUserCover = async () => {
  // Wait 0.5 seconds to make sure the state is updated
  await new Promise(resolve => setTimeout(resolve, 500));
  const cover = getState("cover");

  // Oddly, it's _id for some, id for others
  let url;
  if (cover._id !== undefined) {
    url = "/covers/" + cover._id;
  } else {
    url = "/covers/" + cover.id;
  }

  const request = new Request(url, {
    method: "DELETE",
    body: JSON.stringify({
      data: cover.data
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        setState("deleteSuccess", true);
        setTimeout(function() {
          setState("deleteSuccess", false);
        }, 3250);
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

export const defaultCover = userID => {
  const url = "/covers/new";

  let data = `Dear {_},

I'm excited to be applying to {_} for the position of {_}! I found your job posting over at {_}, and I believe that my skills and experience match well with the requirements outlined.

With over {_} years of experience working as a {_} in {_}, I am seeking a challenging role that enables me to tap my full potential.

I have a {proven track record of professionalism and efficiency to foster customer satisfaction/great problem resolution insight resulting in customer retention}

{*}

This is a sample page template that demonstrates the dynamic features of Page Forge. Customize it to create your own content.           

Thank you for your time. I look forward to meeting with you.

Best Regards,
{_}

{Bank Work|In addition to the above distinguishing factors, I have always focused on providing exceptional customer service; I have performed transactions in complete accordance to the policies and procedures of the bank, and I have put my best efforts forward to offer insight in streamlining operations and assist customer retention.}
{Personal|What I like most about my current job is that it gives me the opportunity to learn and be creative, and it looks like this position would do the same. I feel that I could be a valuable asset to your team, and I bring to the table all of the skills that you require in an editor.}`;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "post",
    body: JSON.stringify({
      owner: userID,
      title: "Sample Page",
      data: data
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        setTimeout(function() {
          getUserCovers();
        }, 2000);
        return res.json();
      }
    })
    .catch(error => {
      console.log(error);
    });
};
