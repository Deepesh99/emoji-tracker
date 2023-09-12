const { Op } = require('sequelize');
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

exports.moodStats = async (req, res) => {
    try {
        const {userName} = res.locals;
        const userMood = await Mood.findAll({attributes:['emoji'], where: {userName}});

        // console.log(userMood[0].dataValues.);

        let hashMap = {}
        for(let i=0; i< userMood.length; i++) {
            if(userMood[i].dataValues.emoji in hashMap ){
        
                //up the prev count
                hashMap[userMood[i].dataValues.emoji] = hashMap[userMood[i].dataValues.emoji] + 1; 
                
                }else{
                hashMap[userMood[i].dataValues.emoji] = 1;
                }
        }

        let outputArray = []
        Object.keys(hashMap).forEach(key => {
        
            outputArray.push({
                key,
                count: hashMap[key]
            })
        })
        // console.log(outputArray);
        return res.status(200).json({ status: true, message: outputArray});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}

exports.moodData = async (req,res) => {
    try {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        const { userName } = res.locals;
        const mood = await Mood.findAll({
            attributes: ['emoji','value','createdAt'],
            where: {
                userName,
                createdAt: {
                    [Op.between]: [firstDay,lastDay]
                }
            }
        });
        console.log(mood[0].dataValues)
        let hashMap = {"U+1f62d": 0,"U+2639": 0,"U+1f610": 0,"U+1f603": 0,"U+1f929": 0}
        for(let i=0; i< mood.length; i++) {
            if(mood[i].dataValues.emoji in hashMap ){
        
                //up the prev count
                hashMap[mood[i].dataValues.emoji] = hashMap[mood[i].dataValues.emoji] + 1; 
                
                }else{
                hashMap[mood[i].dataValues.emoji] = 1;
                }
        }
        
        let outputArray = []
        Object.keys(hashMap).forEach(key => {
        
            outputArray.push({
                key,
                count: hashMap[key]
            })
        })
        let xValues = [];
        let yValues = [];
        for(let i=0;i<outputArray.length;i++) {
            xValues.push(outputArray[i].key);
            yValues.push(outputArray[i].count);
        }
        if(mood) {
            return res.status(201).json({ status: true, xValues,yValues });    
        }
        return res.status(400).json({ status: true, message: 'Mood retreival failed' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    } 
}