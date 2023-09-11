const express = require('express');

const router = express.Router();

const { login, register } = require('../../controller/auth');
router
.post('/login', login)
.post('/register', register)

module.exports = router;