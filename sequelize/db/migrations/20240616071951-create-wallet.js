"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Wallets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.STRING(225),
        allowNull: false,
        unique: true,
      },
      poin: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_earn: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_withdrawl: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Wallets");
  },
};
