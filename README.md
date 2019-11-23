# WhereDevsDev - News Application Web Server

> "Bad news travels fast. Good news takes the scenic route." - Doug Larson

The owners and administrators of [WhereDevsDev](https://www.wheredevs.dev/) want to deliver the best tech news to you via the scenic route ;)

This web server is used as a back-end for [this](https://github.com/wheredevsdev/news-stream-client) client. Also comes with a Telegram bot review system where articles pulled off the internet are sent for review and only shown on client if approved by an administrator or owner of this organization.

## Initial Setup

1. Ensure you have received a `.env` file from a WDD Owner/Administrator. You can also create your own. Required variables in the `.env` file are as follows:
    ```
    DB= # MongoDB URI
    TOKEN= # TG Bot API Token
    CHATID= # TG chat ID of group to send articles for review in
    NEWSAPITOKEN= # API token for newsapi.org
    PORT= # HTTP server port number (Defaults to 8080)
    ```
    Once created or received, put this file in the root of your local repository.
2. Install required node modules using
    ```
    npm i
    ```

3. Entry point for this application is `app.js`. You can run the application directly in VSCode as launch configurations are already created in `.vscode/launch.json` or you can directly run from terminal using:
    ```
    node app.js
    ```
