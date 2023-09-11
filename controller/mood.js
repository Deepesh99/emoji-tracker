const { Op } = require('sequelize');
const User = require('../schema/user');
const Emoji = require('../schema/emoji');

exports.moodSummary = async (req, res) => {
    try {

        // TODO: work on date
        const {year, month} = req.query;
        const y = parseInt(year,10);
        const m = parseInt(month,10);
        console.log(typeof(y));
        d = new Date(); 
        const startDate = new Date(y,m-1).toISOString();
        const endDate = new Date(y,m).toISOString();
        
        const userName = 'deepesh';
        const mood = await Emoji.findAll({
            where: {
                userName,
                createdAt: {
                    [Op.between]: [startDate,endDate]
                    // [Op.between]: ["2023-09-01T00:00:00.000Z","2023-09-30T23:59:59.000Z"]
                }
            }
        });
        // console.log(mood.dataValues.date);
        if(mood) {
            return res.status(201).json({ status: true, mood });    
        }
        return res.status(400).json({ status: true, message: 'Mood retreival failed' });

    } catch(err) {
        console.log(err);
        // return res.status(500).json({ status: false, message: 'Server Error' });
    }
};

exports.moodLog = async (req, res) => {
    const { emoji, notes, userName } = req.body;

    try {
        console.log(emoji,notes,userName);
        const newMood = await Emoji.create({
            emoji,
            notes,
            userName,
            date: new Date()
        });
        if(newMood) {
            return res.status(201).json({ status: true, message: 'Mood Logged' });    
        }
        return res.status(400).json({ status: true, message: 'Loggin Failed' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
};

exports.moodUpdate = async (req, res) => {

};

exports.moodDelete = async (req, res) => {

};