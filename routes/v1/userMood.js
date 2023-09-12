const express = require('express');

const router = express.Router();
const { authorization } = require('../../middleware/auth');
const { moodStats, moodData, moodHistory, moodBoard, toggleSharing } = require('../../controller/userMood');

router
  .get('/stats', authorization,moodStats)
  .get('/data',authorization,moodData)
  .get('/history',authorization,moodHistory)
  .get('/:userName',moodBoard)
  .patch('/toggle-sharing',authorization,toggleSharing)

module.exports = router;