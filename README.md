<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

Heroku Deployment

Creating a Heroku remote
```powershell
git branch -M main
heroku create -a dev-sr-chat-backend
git remote -v
heroku features:enable http-session-affinity // Enable Websocket
git push heroku main
# git subtree push --prefix server heroku master
```
For an existing Heroku app

```powershell
git branch -M main
heroku git:remote -a dev-sr-chat-backend
heroku features:enable http-session-affinity // Enable Websocket
git push heroku main
# git subtree push --prefix server heroku master
```

> Heroku says : Cannot find module 'socket.io'

```powershell
yarn add @nestjs/websockets @nestjs/platform-socket.io
yarn add socket.io @types/socket.io
```


## Specifying a Yarn Version

If a yarn.lock file is found at the root of your application along with package.json, Heroku will download and install Yarn and use it to install your dependencies. However, you should specify which version you are using locally so that same version can be used on Heroku.

{
  "name": "myapp",
  "description": "a really cool app",
  "version": "1.0.0",
  "engines": {
    "yarn": "1.x"
  }
}


    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false yarn --cwd frontend install && yarn --cwd frontend build"