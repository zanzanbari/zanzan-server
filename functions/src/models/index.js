// module.exports = db;
//const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../config/dbConfig')['development']; // 이러면 dbConfig는 development가 됨
const Sequelize = require('sequelize');
const Driver = require('./drivers');
const Run = require('./runs');
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
db.Driver = Driver;
db.Run = Run;

User.init(sequelize);
Driver.init(sequelize);
Run.init(sequelize);

User.associate(db);
Driver.associate(db);
Run.associate(db);

module.exports = db;