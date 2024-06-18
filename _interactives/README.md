# Building an Interactive

## Dependencies

Install dependencies:

- Install [Node.js](https://nodejs.org/) on your system
- Install [VSCode](https://code.visualstudio.com/)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- (Optional) [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode)

Add the following to your VSCode settings:

~~~json
  "[typescript]": {
    "editor.tabSize": 2,
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
  },
~~~

## Creating Interactives

~~~bash
bash new-library.sh PACKAGE_NAME AUTHOR_NAME DESCRIPTION
cd PACKAGE_NAME
npm install OTHER_PACKAGES
~~~

NOTE: `PACKAGE_NAME` should be a single word (no spaces) using PascalCase.

For example:

~~~bash
bash new-library.sh WMRGraph "Anthony J. Clark" "A WMR kinematics graph library using JSXGraph."
~~~

Each interactive will have its own

- configuration files
  - `package.json`
  - `eslint.config.mjs`
  - `tsconfig.json`
  - `vite.config.mjs`
  - `.quokka`
- sources files
  - `index.html`
  - `src/index.ts`
  - `css/main.css`
  - `lib/main.ts`

Stick to these packages when creating new interactives:

- [JSXGraph](https://jsxgraph.org/) for 2D graphics
- [three.js](https://threejs.org/) for 3D graphics

Let me know if you want to add additional dependencies.

## Note About ESLint

ESLint version 9 is the latest version (as of this writing). However, eslint@^8 is the latest version compatible with @stylistic/eslint. We will move to eslint@latest later (using `npm init @eslint/config@latest`).

Might also take a look at [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn).
