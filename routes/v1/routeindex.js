const express = require('express');

const router = express.Router();

const moodRoutes = require('./mood');
const userRoutes = require('./user');

router.use('/mood', moodRoutes); // routes for mood services
router.use('/user', userRoutes); // routes for user services

module.exports = router;
