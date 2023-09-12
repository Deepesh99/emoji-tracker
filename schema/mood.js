const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Mood = sequelize.define('mood', {
  mood_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emoji: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = Mood;
