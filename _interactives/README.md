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
~~~

For example:

~~~bash
bash new-interactive.sh Kinematics "Anthony J. Clark" "A simple interactive for differential drive kinematics."
~~~

## Note

We are using eslint@^8 since it is the latest version compatible with @stylistic/eslint.

We will move to eslint@latest later (using `npm init @eslint/config@latest`).

Might also take a look at [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn).
