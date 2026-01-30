const User = require("./User");
const EmailVerification = require("./EmailVerification");
const PasswordReset = require("./PasswordReset");
const RememberToken = require("./RememberToken");

User.hasMany(EmailVerification, { foreignKey: "userId" });
EmailVerification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(PasswordReset, { foreignKey: "userId" });
PasswordReset.belongsTo(User, { foreignKey: "userId" });

User.hasMany(RememberToken, { foreignKey: "userId" });
RememberToken.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, EmailVerification, PasswordReset, RememberToken };
