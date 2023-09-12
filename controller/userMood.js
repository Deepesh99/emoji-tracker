const Mood = require('../schema/mood');
const User = require('../schema/user');

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

exports.moodHistory = async (req, res) =>{
    try{
        const visitor = res.locals.userName; 
        const { userName } = req.body;
        const user = await User.findOne({attributes: ['isSharing'], where:{userName}});
        const isSharing = user.dataValues.isSharing;
        if (!isSharing) {
            return res.status(400).json({ status: false, message: 'User has not enabled sharing' });
        }
        const moodHistory = await Mood.findAll({attributes:['mood_id', 'emoji', 'notes', 'value', 'createdAt'], where:{userName}});

        return res.status(201).json({ status: true, message: {userName, moodHistory} });
        
    }catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}

exports.toggleSharing = async (req, res) => {
    try {
        const {userName} = res.locals;
        const {value} = req.body;
        const isSharing = (value.toLowerCase() === 'true');
        console.log(isSharing);
        await User.update({isSharing}, {where:{userName}});
        return res.status(201).json({ status: true, message: "sharing status updated"});
    }catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}