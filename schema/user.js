const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
  userName: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isSharing: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
