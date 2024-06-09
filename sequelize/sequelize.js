const { Sequelize, DataTypes } = require("sequelize");
const { transaction_history } = require("../src/config/database");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define(
  "User",
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
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.STRING(225),
      unique: true,
    },
  },
  {
    tableName: "profiles",
    timestamps: false,
  }
);

const Otp_verification = sequelize.define(
  "Otp_verification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(225),
      unique: true,
    },
  },
  {
    tableName: "otp_verifications",
    timestamps: false,
  }
);

const Poin = sequelize.define(
  "Poin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(225),
      unique: true,
    },
  },
  {
    tableName: "poins",
    timestamps: false,
  }
);

const Transaction_history = sequelize.define(
  "Transaction_history",
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transaction_histories",
    timestamps: false,
  }
);

// relationship

// user has one-to-one relationship with profile
User.hasOne(Profile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Profile.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// user has one-to-one relationship with otp_verification
User.hasOne(Otp_verification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Otp_verification.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// user has one-to-one relationship with poin
User.hasOne(Poin, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Poin.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// user has one-to-many relationship with transaction_history
User.hasMany(Transaction_history, {
  as: "Sender",
  foreignKey: "senderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Transaction_history, {
  as: "Recipient",
  foreignKey: "recipientId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Transaction_history.belongsTo(User, {
  as: "Sender",
  foreignKey: "senderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Transaction_history.belongsTo(User, {
  as: "Recipient",
  foreignKey: "recipientId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


module.exports = {
  User,
  Profile,
  Otp_verification,
  Poin,
  Transaction_history,
}