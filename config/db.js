const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('emoji', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
