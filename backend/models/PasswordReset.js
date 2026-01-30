const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/db");

const PasswordReset = sequelize.define(
  "PasswordReset",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    tokenHash: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "password_resets" }
);

module.exports = PasswordReset;
