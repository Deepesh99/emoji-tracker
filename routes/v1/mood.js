const express = require('express');

const router = express.Router();

const {
  moodSummary,
  moodLog,
  moodUpdate,
  moodDelete,
  getEmoji,
} = require('../../controller/mood');

const { authorization } = require('../../middleware/auth');

// authorization is a middleware that ensures user is logged in before performing any action
router
  .get('/summary', authorization, moodSummary)
  .post('/log', authorization, moodLog)
  .put('/update/:id', authorization, moodUpdate)
  .delete('/delete', authorization, moodDelete)
  .get('/get-emoji', authorization, getEmoji)
  .get('/', (req, res) => {
    res.send('API under constrcution');
  });

module.exports = router;
