const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const RememberToken = sequelize.define(
  "RememberToken",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    tokenHash: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "remember_tokens",
    timestamps: true,
  }
);

module.exports = RememberToken;
