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
    <td>State Zero</td>
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
# install server dependencies in the root directory
npm install

# install frontend dependencies in the client directory
cd client
npm install
```

Alternatively, you can run `npm run-script setup` in the root directory which runs a script to execute all the above commands. This is a shortcut command defined in [package.json](package.json).

```
# create a development build of React app
cd client
npm run build

# create Mongo database and run Express server in the root directory
mkdir mongo-data
mongod --dbpath mongo-data

# run the server on a separate terminal
node server.js
```

### Development

During development, run the following commands for your app to reflect any changes in the code. Make sure mongo is running on a separate terminal.

```
# build the React app
cd client
npm run build

# go back to the root directory
cd ..

# run the server
node server.js
```

Alternatively, you can run `npm run-script build-run` in the root directory which runs a script to execute all the above commands. This is a shortcut command defined in [package.json](package.json).

### Directory Structure

```
Page Forge
├── db
│   └── mongoose.js
├── models
│   └── ...
├── package.json
├── server.js
└── client
    ├── public
    │   ├── index.html
    │   └── ...
    ├── tests
    │   └── ...
    └── src
        ├── actions
        │   ├── ...
        ├── react-components
        │   └── ...
        ├── index.js
        ├── index.css
        ├── App.js
        ├── App.css
        ├── MainView.js
        ├── package.json
        └── serviceWorker.js
```

### React Components

Each React component lives in a separate directory with its own `index.js` and `styles.css`. Import them from parent components as needed.

#### Styles

Unique styles associated with each React component are kept separate. If the same styles are shared between multiple React components, keep them in a top-level, shared CSS file (i.e. App.css) to avoid repeated styles.

#### Material UI

You can find more components [here](https://material-ui.com/).

Note that you can override the default styles of these components by increasing CSS selector specificity.

#### Actions

To keep your `index.js` files clean and simple, import required methods from an associated action file. Following this structure can help organize your code and keep it manageable.

#### Statezero

Application state is maintained as a single, immutable, global state graph. See
[statezero documentation](https://github.com/andornaut/statezero/blob/master/README.md) for more information.

Whenever the global state changes via [actions](client/src/actions), each component's `filterState()` method is invoked with a
frozen copy of the new state and then its `render()` method is invoked.

Statezero makes it simple to read and update the global state in your app without having to pass around component states.

### Deployment

#### MongoDB Atlas
1. Create a Project, and cluster (or use the default Project0 Sandbox Cluster)
2. In the left sidebar menu: In security, whitelist 0.0.0.0/0 (or select connect from anywhere)
3. Under the database access tab, add a user that has read/write access
4. Grab the connection string for your database and plug in your password

#### Glitch
In ⚩.env, set up the two variables below:
```
MONGODB_URI='<connection-string>'
PORT='3000'
```

When installing modules in glitch, use `pnpm install` instead of `npm`, as it would avoid using up the set amount of disk space.  
To use, begin by enabling pnpm through: `enable-pnpm`.

Then, the full command to execute is:
```
pnpm install && cd client && pnpm install && pnpm run build
```