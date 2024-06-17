# Building an Interactive

## Dependencies

Install dependencies:

- Install [Node.js](https://nodejs.org/) on your system
- Install [VSCode](https://code.visualstudio.com/)
- Install these extensions
  - [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following to your VSCode settings:

~~~json
  "[typescript]": {
    "editor.tabSize": 2,
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
~~~

## Creating Interactives

~~~bash
bash new-interactive.sh PACKAGE_NAME AUTHOR_NAME DESCRIPTION
cd PACKAGE_NAME
npm install OTHER_PACKAGES
~~~

For example:

~~~bash
bash new-interactive.sh Kinematics "Anthony J. Clark" "A simple interactive for differential drive kinematics."
~~~

Each interactive will have its own `eslint.config.mjs` and `tsconfig.json` files.

We'll try to stick with the following packages:

- [JSXGraph](https://jsxgraph.org/) for 2D graphics
- [three.js](https://threejs.org/) for 3D graphics

## Note

We are using eslint@^8 since it is the latest version compatible with @stylistic/eslint.

We will move to eslint@latest later (using `npm init @eslint/config@latest`).

Might also take a look at [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn).

## TODO

- Make quokkajs optional
  - Add as program argument to new-interactive.sh
  - Add to package.json
  - Add global config stuff

Install with

~~~bash
# Probably use this
npm install --save path/to/_interactives/PACKAGE_NAME

# Or (does not run hooks)
cd PACKAGE_NAME
npm link

cd OTHER_PACKAGE
npm link PACKAGE_NAME
~~~
