// module.exports = db;
//const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../../config/dbConfig'); // 이러면 dbConfig는 development가 됨
const Sequelize = require('sequelize');
const User = require('./user');

const db = {};
const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  dbConfig.development,
);

db.sequelize = sequelize;
db.User = User;

User.init(sequelize);

User.associate(db);

module.exports = db;