import { getState, setState } from "../store";
import { autoHide } from "./helpers";

export const newCover = title => {
  const url = "/covers/new";
  
  let userCover = JSON.stringify({
      owner: getState("userID"),
      title: title,
      data: ""
    })

  const request = new Request(url, {
    method: "post",
    body: userCover,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(res => {
      if (res.status === 200) {
        setState("coverSuccess", true);
        autoHide("coverSuccess");
        getUserCovers();
        setState("cover", userCover);
      }
    })
    .catch(error => {
      console.log(error);
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

export const saveUserCover = () => {
  const cover = getState("cover");
  const url = "/covers/" + cover._id;

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

  fetch(request)
    .then(res => {
      if (res.status === 200) {
        setState("saveSuccess", true);
        autoHide("saveSuccess");
        return res.json();
      } else {
        console.log(res);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteUserCover = () => {
  const cover = getState("cover");
  const url = "/covers/" + cover._id;

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

  fetch(request)
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

export const defaultCover = userID => {
  const templates = [
    {
      title: "Cover Letter",
      data: `Dear {_},

I am writing to express my strong interest in the {_} position at {_}. I came across this opportunity {on your website/through LinkedIn/on Indeed/via a referral}, and I believe my background makes me an excellent fit for your team.

{*}

Over the past {_} years, I have built expertise in {_}, with a particular focus on {_}. I am drawn to {_} because of its commitment to {_}, and I am confident I can contribute meaningfully from day one.

Thank you for considering my application. I would welcome the chance to discuss this role further at your convenience.

Sincerely,
{_}

{Accomplishments|During my time at my previous role, I led a cross-functional initiative that resulted in a measurable improvement in team efficiency and directly supported the organization's broader strategic goals.}
{Culture Fit|I am drawn to collaborative, mission-driven environments where curiosity and continuous learning are valued. I believe I would thrive within your culture and contribute positively to the team dynamic.}
{Technical Strength|My hands-on experience with industry tools and my commitment to staying current with best practices allow me to hit the ground running and deliver high-quality work consistently.}`
    },
    {
      title: "Cold-Call Email",
      data: `Subject: {_}

Hi {_},

My name is {_} from {_}. I came across {_} and wanted to reach out directly.

We help {businesses/teams/companies} {save time and reduce costs/scale faster/improve their workflow/increase revenue} with {_}, and based on what I know about {_}, I think there could be a strong fit.

{*}

Would you be open to a quick {10-minute/15-minute/30-minute} call {this week/next week/at your convenience} to explore this?

Best,
{_}
{_} | {_}
{_}

{Value Proposition|Our solution has helped similar companies reduce operational overhead significantly, freeing their teams to focus on higher-impact work. I'd love to walk you through a quick example relevant to your industry.}
{Social Proof|We work with a number of companies in your space and have consistently delivered measurable results within the first 90 days of engagement.}
{Low-Pressure Close|There is no obligation — just a quick conversation to see if what we do is relevant to where you are headed. If it is not a fit, I will say so.}`
    },
    {
      title: "Interview Follow-Up",
      data: `Subject: Thank You — {_} Interview

Dear {_},

Thank you for taking the time to speak with me {today/yesterday} about the {_} role at {_}. I genuinely enjoyed our conversation and came away even more excited about the opportunity.

{*}

I remain very enthusiastic about joining {_} and feel confident that my experience in {_} would allow me to contribute effectively to your team's goals. Please feel free to reach out if there is any additional information I can provide.

I look forward to hearing from you.

Best regards,
{_}

{Specific Moment|One part of our conversation that stood out was the discussion around the team's upcoming priorities. It reinforced that this is exactly the kind of challenge I am looking for, and one where I believe I can make a real impact.}
{Reiterate Interest|The more I learn about the role and the company, the more confident I am that this would be a strong mutual fit. I am genuinely excited about the direction your team is headed.}`
    }
  ];

  const createCover = ({ title, data }) =>
    fetch("/covers/new", {
      method: "POST",
      body: JSON.stringify({ owner: userID, title, data }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    });

  Promise.all(templates.map(createCover))
    .then(() => getUserCovers())
    .catch(error => console.log(error));
};
