const express = require('express');

const router = express.Router();

const { login, register } = require('../../controller/auth');
const userMood = require('./userMood');

router.post('/login', login).post('/register', register);

router.use('/mood', userMood);

module.exports = router;
