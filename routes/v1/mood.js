const express = require('express');

const router = express.Router();

const { moodSummary, moodLog, moodUpdate, moodDelete } = require('../../controller/mood');
const { authorization } = require('../../middleware/auth');

router
  .get('/summary', authorization, moodSummary)
  .post('/log', authorization, moodLog)
  .put('/update/:id', authorization, moodUpdate)
  .delete('/delete', authorization, moodDelete)
  .get('/', (req,res)=> {
      res.send("API under constrcution");
  })
 

module.exports = router;