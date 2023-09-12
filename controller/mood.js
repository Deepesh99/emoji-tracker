const Sentiment = require('sentiment');
const { Op } = require('sequelize');
const User = require('../schema/user');
const Mood = require('../schema/mood');

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
        
        const { userName } = res.locals;
        const mood = await Mood.findAll({
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
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
};

exports.moodLog = async (req, res) => {
    const { emoji, notes } = req.body;
    const { userName }  = res.locals;
    const value = 2;
    try {
        console.log(emoji,notes,userName);
        const newMood = await Mood.create({
            emoji,
            notes,
            value,
            userName
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
    try {
        const mood_id = req.params.id;
        const { emoji, notes } = req.body;
        const mood = await Mood.findOne( {where: {mood_id}});
        console.log(mood);
        const moodUpdate = await mood.update({emoji, notes});
        if(moodUpdate) {
            return res.status(201).json({ status: true, message: 'Mood Updated' });    
        }
        return res.status(400).json({ status: true, message: 'Updation Failed' });

    }catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
};

exports.moodDelete = async (req, res) => {
    try {
        const { mood_id } = req.body;

        const deletedMood = await Mood.destroy({ where:{mood_id} });
        if(deletedMood) {
            return res.status(201).json({ status: true, message: 'Mood Deleted' });    
        }
        return res.status(400).json({ status: true, message: 'Deletion Failed' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
};

exports.getEmoji = async (req,res) =>{
    try {
        const {text} = req.body;
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
        const score = result.score + 5;
        let emoji
        if(score < 2) {
            emoji = 'U+1f62d';
        } else if (score < 4) {
            emoji = 'U+2639';
        } else if (score < 6) {
            emoji = 'U+1f610';
        } else if (score < 18) {
            emoji = 'U+1f603';
        } else {
            emoji = 'U+1f929';
        }
        return res.status(200).json({ status: true, message: { emoji} });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}