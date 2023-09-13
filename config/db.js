require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamps: true,
    },
    logging: false,
  },
);

module.exports = sequelize;
