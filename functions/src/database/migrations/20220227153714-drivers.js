'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('drivers', {
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
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
