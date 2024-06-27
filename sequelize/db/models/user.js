"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Otp_verification, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasOne(models.Wallet, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Transaction_history, {
        as: "Sender",
        foreignKey: "senderId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Transaction_history, {
        as: "Recipient",
        foreignKey: "recipientId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING(225),
        primaryKey: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(15),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(225),
        unique: true,
        allowNull: true,
      },
      profile_picture: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
