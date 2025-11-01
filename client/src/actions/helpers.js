import { setState } from "statezero";

// Initialize all state paths used by your app as empty.
// These are the states that you can filter using filterState()
// as needed by specific components. All component classes that read
// from these state paths must extend BaseReactComponent class.
//
// - currentUser state path is used by the root App component
// - studentForm and message state paths are used by the StudentForm component
// - studentList state path is used by the StudentList component
export const setEmptyState = () => {
  setState("currentUser", null);
  setState("loginForm", { username: "", password: "" });
  setState("userID", null);

  // Snackbar login resources
  setState("loginClick", false);
  setState("loginError", false);
  setState("loginFailed", false);
  setState("registered", false);
  setState("passwordShort", false);
  setState("invalidUsername", false);

  // Snackbar Cover resources
  setState("coverTitle", null);
  setState("coverShort", false);
  setState("coverSuccess", false);

  // Cover Resources
  setState("cover", null);
  setState("info", false);
  setState("deleteC", false);
  setState("userCovers", null);
  setState("saveSuccess", false);
  setState("deleteSuccess", false);

  setState(
    "introCover",
    `I've gone ahead and created a sample page for you. You can create your own or access the sample by clicking the hamburger menu on the top left corner of the page.

For a quick guide, you can create input forms with {_}.

Selectors can be created with {this/that/or anything else}.

To create paragraph selectors, use:

{*}

But to create paragraphs themselves, you can set them up like the end of this text.
They're then hidden and accessible only from the paragraph selector!

Treat this as you would MarkDown, then edit the final version and copy it to your clipboard.

If you have any questions, comments, or issues, please open a story on github.

{Sample Paragraph|Lorem Ipsum and so on}
{Another one|What's the rest of Lorem Ipsum?}`
  );

  setState("tryCover", {
    data: `Hello, and welcome to Page Forge! The way this web-app works is by requiring you, the user, to first provide the "markdown".

You'll notice that the left side is where you provide the raw text. On the right side, the formatted version appears. Your forged page then provides the fields for you to work with.

For a quick guide, you can create input forms with {_}.

Selectors can be created with {this/that/or anything else}.

To create paragraph selectors, use:

{*}

But to create paragraphs themselves, you can set them up like the end of this text.
They're then hidden and accessible only from the paragraph selector!

Treat this as you would markdown, then edit the final version and copy it to your clipboard.

If you have any questions, comments, or issues, please open a story on GitHub.

{Sample Paragraph|Lorem Ipsum and so on}
{Another one|What's the rest of Lorem Ipsum?}`
  });
};
