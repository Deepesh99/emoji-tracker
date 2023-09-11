const express = require('express');

const router = express.Router();

router
.get('/', (req,res) => {
    res.send("This Mood API working");
});

module.exports = router;