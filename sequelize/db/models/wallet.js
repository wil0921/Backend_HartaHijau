"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Wallet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(225),
        unique: true,
      },
      poin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_earn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_withdrawl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "Wallets",
    }
  );
  return Wallet;
};
