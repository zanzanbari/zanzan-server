const Sequelize = require('sequelize');

module.exports = class Run extends Sequelize.Model {
    static init(sequelize) { // 테이블 컬럼 설정
        return super.init({
            // userId: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // },
            // driverId: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // },
            id: {
                type: Sequelize.INTEGER,
                allowNull:false,
                unique:true,
                autoIncrement: true,
                primaryKey: true,
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
            modelName: 'Run',
            tableName: 'runs',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Run.belongsTo(db.User, {
            foreignKey: 'userId',
            targetKey: 'id'
        });
        db.Run.belongsTo(db.Driver, {
            foreignKey: 'driverId',
            targetKey: 'id'
        });
    }
}