const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) { // 테이블 컬럼 설정
        return super.init({
            social: {
                type: Sequelize.STRING(15),
                allowNull: false,
                defaultValue: 'local',
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            nickname: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            refreshtoken: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        }, { // 테이블 자체 설정
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.belongsToMany(db.Driver,{through:'Run', foreignKey: 'userId'});
    }
}