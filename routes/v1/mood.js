const express = require('express');

const router = express.Router();

const { moodSummary, moodLog, moodUpdate, moodDelete } = require('../../controller/mood');

router
.get('/summary', moodSummary)
.post('/log', moodLog)
// .patch('/update', moodUpdate)
// .delete('/delete', moodDelete)
.get('/', (req,res)=> {
    res.send("API under constrcution");
})

module.exports = router;