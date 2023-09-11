const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Emoji = sequelize.define('emoji', {
  emoji_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  emoji: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Emoji;
