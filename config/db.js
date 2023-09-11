const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('emoji', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    timestamps: true
  },
  // logging: false
});

module.exports = sequelize;
