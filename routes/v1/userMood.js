const express = require('express');

const router = express.Router();
const { authorization } = require('../../middleware/auth');
const { moodHistory, moodBoard, toggleSharing } = require('../../controller/userMood');

router
//   .get('/stats',)
//   .get('/data',)
  .get('/history',authorization,moodHistory)
  .get('/:userName',moodBoard)
  .patch('/toggle-sharing',authorization,toggleSharing)

module.exports = router;