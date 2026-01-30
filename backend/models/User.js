const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "admin", // admin / user / manager
    },

    // 🔥 NEW — organisation support
    organisation_name: {
      type: DataTypes.STRING,
      allowNull: true, 
      // admin → nullable
      // user  → must be filled (enforced in backend logic)
    },

    // 🔥 NEW — who created this user
    created_by_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // null → self-registered admin
      // value → admin-created user
    },

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
  }
);

module.exports = User;
