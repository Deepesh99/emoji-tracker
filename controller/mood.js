const Sentiment = require('sentiment');
const { Op } = require('sequelize');
const Mood = require('../schema/mood');

/**
 *  This function gives a summary on mood for a particular month
 * @param {*} req - takes year and month fron request
 * @param {*} res 
 * @returns mood summary
 */
exports.moodSummary = async (req, res) => {
  try {
    // TODO: work on date
    const { year, month } = req.query;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const startDate = new Date(y, m - 1).toISOString();
    const endDate = new Date(y, m).toISOString();

    const { userName } = res.locals;
    const mood = await Mood.findAll({
      where: {
        userName,
        createdAt: {
          [Op.between]: [startDate, endDate],
          // [Op.between]: ["2023-09-01T00:00:00.000Z","2023-09-30T23:59:59.000Z"]
        },
      },
    });
    // console.log(mood.dataValues.date);
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

/**
 * This function takes users mood data and enter to db
 * @param {*} req - takes emoji and notes from body
 * @param {*} res 
 * @returns status message 
 */
exports.moodLog = async (req, res) => {
  const { emoji, notes } = req.body;
  const { userName } = res.locals;
  const value = 2;
  try {
    console.log(emoji, notes, userName);
    const newMood = await Mood.create({
      emoji,
      notes,
      value,
      userName,
    });
    if (newMood) {
      return res.status(201).json({ status: true, message: 'Mood Logged' });
    }
    return res.status(400).json({ status: true, message: 'Logging Failed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function helps to update previously logged mood
 * @param {*} req - take emoji and notes form request
 * @param {*} res 
 * @returns status message after update
 */
exports.moodUpdate = async (req, res) => {
  try {
    const mood_id = req.params.id;
    const { emoji, notes } = req.body;
    const mood = await Mood.findOne({ where: { mood_id } });
    console.log(mood);
    const moodUpdate = await mood.update({ emoji, notes });
    if (moodUpdate) {
      return res.status(201).json({ status: true, message: 'Mood Updated' });
    }
    return res.status(400).json({ status: true, message: 'Updation Failed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function helps to delete mood entry from db
 * @param {*} req - takes mood_id from request
 * @param {*} res 
 * @returns status message after deletion
 */
exports.moodDelete = async (req, res) => {
  try {
    const { mood_id } = req.body;

    const deletedMood = await Mood.destroy({ where: { mood_id } });
    if (deletedMood) {
      return res.status(201).json({ status: true, message: 'Mood Deleted' });
    }
    return res.status(400).json({ status: true, message: 'Deletion Failed' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

/**
 * This function uses sentiment analysis library to convert text to emoji and suggest emoji to users based on notes
 * @param {*} req - text from user notes
 * @param {*} res 
 * @returns emoji based on notes
 */
exports.getEmoji = async (req, res) => {
  try {
    const { text } = req.body;

    // using sentiment analysis library to get a score between -5 and +5
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    const score = result.score + 5; // addeding 5 to bring in 0-10 range

    // get emoji based on score
    let emoji;
    if (score < 2) {
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
    return res.status(200).json({ status: true, message: { emoji } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};
