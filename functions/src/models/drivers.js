const Sequelize = require('sequelize');

module.exports = class Driver extends Sequelize.Model {
    static init(sequelize) { // 테이블 컬럼 설정
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                allowNull:false,
                unique:true,
                autoIncrement: true,
                primaryKey: true,
            },
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
                unique: true,
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
        db.Driver.hasOne(db.Run, {
            foreignKey: 'driverId',
            sourceKey: 'id'
        });
    }
}