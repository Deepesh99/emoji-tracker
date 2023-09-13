const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Mood = require('../schema/mood');
const User = require('../schema/user');

/**
 * This function returns aggregated moos of user based on history for mood board
 * @param {*} req - takes username from request
 * @param {*} res 
 * @returns emoji based on aggregated score of mood history
 */
exports.moodBoard = async (req, res) => {
  try {
    const { userName } = req.params;

    // get average of users mood value which can be used as mood score of history
    const moodValue = await Mood.findAll({
      attributes: [[Sequelize.fn('avg', Sequelize.col('value')), 'rating']],
      where: { userName },
    });
    const { rating } = moodValue[0].dataValues.rating;
    let emoji; // assign emoji based on rating
    if (rating < 2) {
      emoji = 'U+1f62d';
    } else if (rating < 4) {
      emoji = 'U+2639';
    } else if (rating < 6) {
      emoji = 'U+1f610';
    } else if (rating < 18) {
      emoji = 'U+1f603';
    } else {
      emoji = 'U+1f929';
    }
    return res.status(200).json({ status: true, message: { userName, emoji } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function is used to get user's mood history if sharing is enabled
 * @param {*} req - takes username from request
 * @param {*} res 
 * @returns desired users mood history is sharing is enabled
 */
exports.moodHistory = async (req, res) => {
  try {
    // const visitor = res.locals.userName;
    const { userName } = req.params;
    const user = await User.findOne({
      attributes: ['isSharing'],
      where: { userName },
    });

    const { isSharing } = user.dataValues;
    if (!isSharing) {
      return res
        .status(400)
        .json({ status: false, message: 'User has not enabled sharing' });
    }
    const moodHistory = await Mood.findAll({
      attributes: ['mood_id', 'emoji', 'notes', 'value', 'createdAt'],
      where: { userName },
    });

    return res
      .status(201)
      .json({ status: true, message: { userName, moodHistory } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function is used to toggling sharing status of user's mood histor
 * @param {*} req 
 * @param {*} res 
 * @returns staus message after changes
 */
exports.toggleSharing = async (req, res) => {
  try {
    const { userName } = res.locals;
    const { value } = req.body;
    const isSharing = value.toLowerCase() === 'true';

    await User.update({ isSharing }, { where: { userName } });
    return res
      .status(201)
      .json({ status: true, message: 'sharing status updated' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function is used to get mood stats over time
 * @param {*} req 
 * @param {*} res 
 * @returns return mood stats overtime
 */
exports.moodStats = async (req, res) => {
  try {
    const { userName } = res.locals;
    const userMood = await Mood.findAll({
      attributes: ['emoji'],
      where: { userName },
    });

    // create hashmap to count occurence of emoji
    const hashMap = {};
    for (let i = 0; i < userMood.length; i += 1) {
      if (userMood[i].dataValues.emoji in hashMap) {
        hashMap[userMood[i].dataValues.emoji] += 1;
      } else {
        hashMap[userMood[i].dataValues.emoji] = 1;
      }
    }

    // convert hashmap to array
    const outputArray = [];
    Object.keys(hashMap).forEach((key) => {
      outputArray.push({
        key,
        count: hashMap[key],
      });
    });

    return res.status(200).json({ status: true, message: outputArray });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function visualizes mood data in emoji format for current month
 * @param {*} req 
 * @param {*} res 
 * @returns X and Y values using which chart can be plotted
 */
exports.moodData = async (req, res) => {
  try {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const { userName } = res.locals;
    const mood = await Mood.findAll({
      attributes: ['emoji', 'value', 'createdAt'],
      where: {
        userName,
        createdAt: {
          [Op.between]: [firstDay, lastDay],
        },
      },
    });

    // creating a hashmap to get count of all emojies used in month
    const hashMap = {
      'U+1f62d': 0,
      'U+2639': 0,
      'U+1f610': 0,
      'U+1f603': 0,
      'U+1f929': 0,
    };
    for (let i = 0; i < mood.length; i += 1) {
      if (mood[i].dataValues.emoji in hashMap) {
        hashMap[mood[i].dataValues.emoji] += 1;
      } else {
        hashMap[mood[i].dataValues.emoji] = 1;
      }
    }

    const outputArray = [];
    Object.keys(hashMap).forEach((key) => {
      outputArray.push({
        key,
        count: hashMap[key],
      });
    });

    // get x and y values 
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < outputArray.length; i += 1) {
      xValues.push(outputArray[i].key);
      yValues.push(outputArray[i].count);
    }
    if (mood) {
      return res.status(201).json({ status: true, xValues, yValues });
    }
    return res
      .status(400)
      .json({ status: true, message: 'Mood retreival failed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function is used for sorting and filtering
 * @param {*} req - takes sort, start(startdate), and end(enddate) from request
 * @param {*} res 
 * @returns mood data for specified timefrom in desired order
 */
exports.getAllMood = async (req, res) => {
  try {
    const { sort, start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const { userName } = res.locals;

    const mood = await Mood.findAll({
      where: {
        userName,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', sort.toUpperCase()]], // apply sort- asc or desc
    });

    if (mood) {
      return res.status(201).json({ status: true, mood });
    }
    return res
      .status(400)
      .json({ status: true, message: 'Mood retreival failed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};
