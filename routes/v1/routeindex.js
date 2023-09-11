const express = require('express');

const router = express.Router();

const moodRoutes = require('./mood');
const userRoutes = require('./user');

router.use('/mood', moodRoutes);
router.use('/user', userRoutes);

module.exports = router;
