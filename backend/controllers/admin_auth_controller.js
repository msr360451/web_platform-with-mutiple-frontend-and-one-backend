const adminAuthService = require("../services/admin_auth_service");

// =======================
// REGISTER
// =======================
exports.register = async (req, res) => {
  try {
    const result = await adminAuthService.register(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =======================
// VERIFY EMAIL
// =======================
exports.verifyEmail = async (req, res) => {
  try {
    const result = await adminAuthService.verifyEmail(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =======================
// LOGIN  ✅ FIXED COOKIE
// =======================
exports.login = async (req, res) => {
  try {
    const result = await adminAuthService.login(req.body);

    // ✅ ACCESS TOKEN COOKIE (CRITICAL FIX)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,        // true only in HTTPS production
      sameSite: "lax",
      path: "/",            // 🔥 REQUIRED (fixes "No token")
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    // ✅ REFRESH TOKEN COOKIE (IF REMEMBER ME)
    if (result.refreshToken) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",            // 🔥 REQUIRED
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }

    // ✅ CLEAN RESPONSE
    res.json({
      message: result.message,
      rememberMe: !!result.refreshToken,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =======================
// FORGOT PASSWORD
// =======================
exports.forgotPassword = async (req, res) => {
  try {
    const result = await adminAuthService.forgotPassword(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =======================
// RESET PASSWORD
// =======================
exports.resetPassword = async (req, res) => {
  try {
    const result = await adminAuthService.resetPassword(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =======================
// LOGOUT
// =======================
exports.logout = async (req, res) => {
  try {
    // ✅ CLEAR COOKIES
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    const result = await adminAuthService.logout(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
