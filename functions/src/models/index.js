// module.exports = db;
//const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../config/dbConfig')['development']; // 이러면 dbConfig는 development가 됨
const Sequelize = require('sequelize');
const User = require('./user');

const db = {};
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig,
);

db.sequelize = sequelize;
db.User = User;

User.init(sequelize);

User.associate(db);

module.exports = db;