const jwt = require("jsonwebtoken");
const Contact = require("../models/contact_model");
const Newsletter = require("../models/newsletter_model");

exports.login = async (email, password) => {
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new Error("Invalid admin credentials");
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

exports.getAllContacts = async () => {
  return await Contact.findAll({
    order: [["createdAt", "DESC"]],
  });
};

exports.getAllSubscribers = async () => {
  return await Newsletter.findAll({
    order: [["createdAt", "DESC"]],
  });
};
