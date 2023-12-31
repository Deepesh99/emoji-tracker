require('dotenv').config();

const express = require('express');

const db = require('./config/db');

// Importing Schema
const User = require('./schema/user');
const Mood = require('./schema/mood');

// Creating association
User.hasMany(Mood, {
  onDelete: 'CASCADE',
  foreignKey: 'userName',
});

const app = express();

const routesIndexV1 = require('./routes/v1/routeindex');

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/v1', routesIndexV1);

db
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log('DB connected!!');
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.error(err);
  });
