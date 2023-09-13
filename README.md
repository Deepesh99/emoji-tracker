# Emoji-tracker

A robust Emoji Mood Tracker API using Node.js, Express.js, and Sequelize. This API empowers users to record daily emotions with emojis while integrating captivating features for an enriched experience and profound insights.

## Pre-requisite

- Have Node.js and MySQL installed.
- Any code editor/IDE (VSCode preffered).

## Setup

- Download zip file from Github.
- Move to folder and open and in editor.
- Run below commands to setup.

```bash
  npm install
```

- Populate env file with values.
- Start the project

```bash
  npm start
```

## API Reference

- Reference [docs](https://documenter.getpostman.com/view/29682712/2s9YC4TXYN#fc11a0ac-478e-4d20-9894-611b335aab13)

## External Libraries & Frameworks

- express - Node.js framework
- jsonwebtoken - To create encode/decode jwt tokens
- bcryptjs - To encrypt password while storing in db and comparing hash during login.
- sequelize - ORM
- mysql2 - To support mysql using sequelize
- sentiment - To perform sentiment analysis
- dotenv - inject credentials into code
- eslint - To enforce code standard (dev)
- prettier - For code formating (dev)
- nodemon - For help with development (dev)
