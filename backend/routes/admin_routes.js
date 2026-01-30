const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin_controller");
const adminAuthController = require("../controllers/admin_auth_controller"); // ✅ NEW

const auth = require("../middleware/auth");

// ✅ AUTH ROUTES (NEW TASK)
router.post("/register", adminAuthController.register);
router.post("/verify-email", adminAuthController.verifyEmail);
router.post("/login", adminAuthController.login);
router.post("/forgot-password", adminAuthController.forgotPassword);
router.post("/reset-password", adminAuthController.resetPassword);
router.post("/logout", adminAuthController.logout);

// ✅ NEW: CHECK LOGIN (cookie/session check)
router.get("/me", auth, (req, res) => {
  res.json({
    ok: true,
    user: req.user, // comes from auth middleware decoded token
  });
});

// ✅ PROTECTED ADMIN DATA ROUTES (keep as it is)
router.get("/contacts", auth, adminController.getContacts);
router.get("/subscribers", auth, adminController.getSubscribers);

module.exports = router;
