# Page Forge

A dynamic page creator that allows you to forge custom pages through the use of a custom markdown solution. This webapp was built with React, Node, and MongoDB - alongside some other frameworks like express, bcrypt, and mui. 

[Use it here!](https://page-forge.novac.dev/)

Preview:

![](readme/preview.gif)

## Overview

When writing templates, you can use the custom symbols below to insert interactive modules in your page.

Name | Text | Symbol | Comment
--- | --- | :---: | ---
Input|{_}|_____|Creates an input field
Selector|{.../.../...}|___ ↓|Allows you to select from any number of text
Paragraph Data|{Title\|Paragraph Text}| |Fills paragraph data to be picked by a field
Paragraph Field|{*}|☰|Creates a paragraph selector to choose a set of data

## Tech Features

<table style="text-align:center;">
  <tr>
    <td>Encrypted Login</td>
    <td>Session Handling</td>
    <td>Zustand</td>
  </tr>
  <tr>
    <td>Adaptive UI</td>
    <td>Single Page</td>
    <td>Memory Optimization</td>
  </tr>
  <tr>
    <td>Dynamic Editing</td>
    <td>Custom Views</td>
    <td><sub><sup>🚧</sup></sub> Auto Save</td>
  </tr>
</table>

------------------------------------------

## Development Instructions

### Setup

```
# install all dependencies (server + client)
npm run setup
```

Or manually:
```
# install server dependencies
npm install

# install frontend dependencies
cd client && npm install
```

Copy `.env.example` to `.env` and fill in your values:
```
cp .env.example .env
```

### Development

Start both the Express server and the Vite dev server in one command from the root directory:

```
npm run dev
```

This runs the backend on port 3001 and the Vite frontend with HMR on port 5173. Make sure MongoDB is running beforehand.

### Production Build

```
# build the frontend
cd client && npm run build

# serve via Express from the root directory
node server.js
```

Alternatively, `npm run build-run` in the root directory runs both steps.

### Directory Structure

```
Page Forge
├── db
│   └── mongoose.js
├── models
│   └── ...
├── .env.example
├── package.json
├── server.js
└── client
    ├── index.html
    ├── vite.config.js
    ├── public
    │   └── ...
    └── src
        ├── actions
        │   └── ...
        ├── react-components
        │   └── ...
        ├── store.js
        ├── index.js
        ├── index.css
        ├── App.js
        ├── App.css
        └── MainView.js
```

### React Components

Each React component lives in a separate directory with its own `index.js` and `styles.css`. Import them from parent components as needed.

#### Styles

Unique styles associated with each React component are kept separate. If the same styles are shared between multiple React components, keep them in a top-level, shared CSS file (i.e. App.css) to avoid repeated styles.

#### Material UI

You can find more components [here](https://mui.com/).

Note that you can override the default styles of these components using the `sx` prop or the `styled` API.

#### Actions

To keep your `index.js` files clean and simple, import required methods from an associated action file. Following this structure can help organize your code and keep it manageable.

#### Zustand

Application state is managed with [Zustand](https://zustand.docs.pmnd.rs/). The store is defined in `client/src/store.js` and exposed via the `useAppStore` hook. State mutations go through [actions](client/src/actions), keeping components clean and focused on rendering.

### Deployment

#### MongoDB Atlas
1. Create a Project, and cluster (or use the default Project0 Sandbox Cluster)
2. In the left sidebar menu: In security, whitelist 0.0.0.0/0 (or select connect from anywhere)
3. Under the database access tab, add a user that has read/write access
4. Grab the connection string for your database and plug in your password

#### Render
1. Create a new **Web Service** on [Render](https://render.com/) and connect your repository
2. Set the **Build Command** to:
```
npm install && cd client && npm install && npm run build
```
3. Set the **Start Command** to:
```
node server.js
```
4. Under **Environment**, add the following variables:
```
MONGODB_URI=<connection-string>
PORT=3000
SESSION_SECRET=<long-random-string>
```