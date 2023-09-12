const Mood = require('../schema/mood');
const Sequelize = require('sequelize');

exports.moodBoard = async (req,res) => {
    try {

        const userName = req.params.userName ;

        const moodValue = await Mood.findAll({attributes: [[Sequelize.fn('avg', Sequelize.col('value')),'rating']], where: {userName}});
        const rating =  moodValue[0].dataValues.rating; 
        if(rating < 2) {
            return res.status(200).json({ status: true, message: { userName, emoji: 'U+1f62d'} });
        } else if (rating < 4) {
            return res.status(200).json({ status: true, message: { userName, emoji: 'U+2639'} });
        } else if (rating < 6) {
            return res.status(200).json({ status: true, message: { userName, emoji: 'U+1f610'} });
        } else if (rating < 18) {
            return res.status(200).json({ status: true, message: { userName, emoji: 'U+1f603'} });
        } else {
            return res.status(200).json({ status: true, message: { userName, emoji: 'U+1f929'} });
        }
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}