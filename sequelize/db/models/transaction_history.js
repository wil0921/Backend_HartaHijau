"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction_history extends Model {
    static associate(models) {
      Transaction_history.belongsTo(models.User, {
        as: "Sender",
        foreignKey: "senderId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Transaction_history.belongsTo(models.User, {
        as: "Recipient",
        foreignKey: "recipientId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Transaction_history.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.STRING(225),
        unique: true,
      },
      recipientId: {
        type: DataTypes.STRING(225),
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("successful", "progress", "failed", "cancelled"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction_history",
      tableName: "Transaction_histories",
    }
  );
  return Transaction_history;
};
