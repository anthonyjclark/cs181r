# Building an Interactive

## Dependencies

Install dependencies:

- Install [Node.js](https://nodejs.org/) on your system
- Install [VSCode](https://code.visualstudio.com/)
- Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension

Add the following to your VSCode settings:

~~~json
  "[typescript]": {
    "editor.tabSize": 2,
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
  },
~~~

### (Optional) Quokka.js

Here are some highly optional instructions for using [Quokka](https://quokkajs.com/).

- Install the [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode) extension
- Install the following packages for use by Quokka:

  ~~~bash
  mkdir -p ~/.quokka
  cd ~/.quokka
  npm install jsdom canvas vite-node
  ~~~

## Creating Interactives

We'll only need a **new** library for some interactives. For other interactives, we can just add functionality to an existing library.

If you need to create a new library, then from inside the `_interactives` directory:

1. Create a new package/library with `bash new-library.sh PACKAGE_NAME AUTHOR_NAME DESCRIPTION`
2. Add all library/reusable code to `lib/main.ts`
3. Install additional packages using `npm install OTHER_PACKAGES`
4. Create a demo using `index.html` and `src/index.ts`
5. Develop the demo using `npm run dev`
6. Build the library using `npm run build`
7. Use the library in a Quarto file (eg, `book/0-NewChapter.qmd`)

For example:

~~~bash
bash new-library.sh WMRGraph "Anthony J. Clark" "A WMR kinematics graph library using JSXGraph."
~~~

Each interactive will have its own

- configuration files
  - `package.json`: additional dependencies will be added here by `npm install`
  - `eslint.config.mjs`: formatting and linting rules
  - `tsconfig.json`: TypeScript configuration
  - `vite.config.mjs`: Vite configuration
  - `.quokka`: Quokka configuration
- sources files
  - `index.html`: demo web page
  - `src/index.ts`: demo source code
  - `css/main.css`: library styles
  - `lib/main.ts`: library source code

Stick to these packages when creating new interactives:

- [JSXGraph](https://jsxgraph.org/) for 2D graphics
- [three.js](https://threejs.org/) for 3D graphics

Let me know if you want to add additional dependencies.

## Interactive Platforms

Let's try to stick to the following example for interactives:

- Holonomic Robot
- Quadrotor (2d and/or 3d)
- Differential Drive Robot
- Tricycle Robot
- Inverted Pendulum

## Note About ESLint

ESLint version 9 is the latest version (as of this writing). However, eslint@^8 is the latest version compatible with @stylistic/eslint. We will move to eslint@latest later (using `npm init @eslint/config@latest`).

Might also take a look at [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn).
