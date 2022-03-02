'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('runs', {
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
