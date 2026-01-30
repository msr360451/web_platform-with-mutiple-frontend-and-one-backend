const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const PasswordReset = require("../models/PasswordReset");
const RememberToken = require("../models/RememberToken");

const { sendMail } = require("../config/mail");

// =====================
// Helpers
// =====================
function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generateRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

// 🔥 FIXED: id (NOT userId)
function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id, // ✅ REQUIRED
      email: user.email,
      role: user.role || "admin",
      organisation_name: user.organisation_name || null,
    },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

// 🔥 FIXED: id (NOT userId)
function signRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id, // ✅ REQUIRED
      email: user.email,
      role: user.role || "admin",
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// =====================
// REGISTER
// =====================
exports.register = async ({ name, email, password, confirmPassword,organisation_name, }) => {
  if (!email || !password) throw new Error("Email and password are required");

  if (!confirmPassword) {
    throw new Error("Confirm password is required");
  }

  if (password !== confirmPassword) {
    throw new Error("Password and Confirm Password do not match");
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name || "",
    email,
    passwordHash,
    organisation_name: organisation_name || null,
    isEmailVerified: false,
    role: "admin",
  });

  const rawToken = generateRandomToken();
  const tokenHash = sha256(rawToken);

  await EmailVerification.create({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    usedAt: null,
  });

const verifyLink =
  `${process.env.FRONTEND_ADMIN_URL}/admin/verify-email?token=${rawToken}&email=${email}`;

  await sendMail({
    to: email,
    subject: "Verify your Email",
    html: `
      <h2>Verify Email</h2>
      <p>Click below link to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>This link expires in 30 minutes.</p>
    `,
  });

  return {
    message: "✅ Verification email sent. Please verify to activate account.",
  };
};

// =====================
// VERIFY EMAIL
// =====================
exports.verifyEmail = async ({ email, token }) => {
  if (!email || !token) throw new Error("Invalid verification link");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email");

  if (user.isEmailVerified) {
    return { message: "✅ Email already verified" };
  }

  const tokenHash = sha256(token);

  const record = await EmailVerification.findOne({
    where: {
      userId: user.id,
      tokenHash,
      usedAt: null,
    },
  });

  if (!record) throw new Error("Invalid or expired token");
  if (new Date(record.expiresAt) < new Date()) throw new Error("Token expired");

  record.usedAt = new Date();
  await record.save();

  user.isEmailVerified = true;
  await user.save();

  return { message: "✅ Email successfully verified!" };
};

// =====================
// LOGIN
// =====================
exports.login = async ({ email, password, rememberMe }) => {
  if (!email || !password) throw new Error("Email and password required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before login");
  }

  const accessToken = signAccessToken(user);
  let refreshToken = null;

  if (rememberMe) {
    refreshToken = signRefreshToken(user);

    await RememberToken.create({
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      revokedAt: null,
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    message: "✅ Login successful",
    accessToken,
    refreshToken,
  };
};

// =====================
// FORGOT PASSWORD
// =====================
exports.forgotPassword = async ({ email }) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return { message: "If this email exists, a reset link will be sent." };
  }

  const rawToken = generateRandomToken();

  await PasswordReset.create({
    userId: user.id,
    tokenHash: sha256(rawToken),
    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    usedAt: null,
  });

const resetLink =
  `${process.env.FRONTEND_ADMIN_URL}/admin/reset-password?token=${rawToken}&email=${email}`;

  await sendMail({
    to: email,
    subject: "Reset your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Click below link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return { message: "If this email exists, a reset link will be sent." };
};

// =====================
// RESET PASSWORD
// =====================
exports.resetPassword = async ({ email, token, newPassword }) => {
  if (!email || !token || !newPassword) throw new Error("Invalid request");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid request");

  const record = await PasswordReset.findOne({
    where: {
      userId: user.id,
      tokenHash: sha256(token),
      usedAt: null,
    },
  });

  if (!record) throw new Error("Invalid or expired reset link");
  if (new Date(record.expiresAt) < new Date())
    throw new Error("Reset link expired");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  record.usedAt = new Date();
  await record.save();

  await RememberToken.update(
    { revokedAt: new Date() },
    { where: { userId: user.id, revokedAt: null } }
  );

  return { message: "✅ Password reset successful. Please login again." };
};

// =====================
// LOGOUT
// =====================
exports.logout = async ({ refreshToken }) => {
  if (!refreshToken) return { message: "✅ Logged out" };

  await RememberToken.update(
    { revokedAt: new Date() },
    {
      where: {
        tokenHash: sha256(refreshToken),
        revokedAt: null,
      },
    }
  );

  return { message: "✅ Logout successful" };
};
