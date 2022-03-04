const Sequelize = require('sequelize');

module.exports = class Driver extends Sequelize.Model {
    static init(sequelize) { // 테이블 컬럼 설정
        return super.init({
            name: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            carType: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            carNumber: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true,
            },
            location: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                allowNull: false,
            },
            photo: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, { // 테이블 자체 설정
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Driver',
            tableName: 'drivers',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Driver.belongsToMany(db.User,{through:'Run', foreignKey: 'driverId'});
    }
}