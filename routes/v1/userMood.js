const express = require('express');

const router = express.Router();

const { moodBoard } = require('../../controller/userMood');

router
//   .get('/stats',)
//   .get('/data',)
//   .get('/history',)
  .get('/:userName',moodBoard)

module.exports = router;