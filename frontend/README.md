# Vite + React + Typescript + TailwindCSS + Eslint + Prettier

A starter for React with Typescript with the fast Vite and all static code testing with Eslint and formatting with Prettier.

![Vite + React + Typescript + Eslint + Prettier + TailwindCSS](./resources/screenshot.jpg)

For more information visit: [Vite](https://github.com/vitejs/vite),[React](https://reactjs.org/),[Typescript](https://www.typescriptlang.org/), [Eslint](https://eslint.org/),[Prettier](https://prettier.io/),[TailwindCSS](https://tailwindcss.com/)

## Installation

```sh
yarn
# or
npm install
```

## Start

After the successful installation of the packages:

```sh
yarn dev
# or
npm run dev
```

## Deployment

[https://vitejs.dev/guide/static-deploy.html#heroku](https://vitejs.dev/guide/static-deploy.html#heroku)



```powershell
heroku apps:create dev-sr-chat-frontend
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
# git subtree push --prefix web heroku master
```




