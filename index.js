const express = require('express');

const db = require('./config/db');

const User = require('./schema/user');
const Emoji = require('./schema/emoji');

User.hasMany(Emoji, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
});
// Emoji.hasOne(User);

const app = express();

const routesIndexV1 = require('./routes/v1/routeindex');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/v1', routesIndexV1)

db
// .sync({ force: true })
.sync()
.then(() => {
  app.listen(3000);
})
.catch((err) => {
  console.error(err);
});
