require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ NEW

const sequelize = require("./config/db");
const contactRoutes = require("./routes/contact_routes");
const newsletterRoutes = require("./routes/newsletter_routes");
const adminRoutes = require("./routes/admin_routes");

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// Middleware
// =====================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // ✅ NEW

// =====================
// Health Check
// =====================
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

// =====================
// Routes
// =====================
app.use("/api/contacts", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", require("./routes/adminUserRoutes"));


// =====================
// Start Server + DB Sync
// =====================
(async () => {
  try {
    await sequelize.sync({ alter: true }); // ✅ IMPORTANT (auto create/update tables)
    console.log("✅ Database connected & synced");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();
