const adminService = require("../services/admin_service");

exports.getContacts = async (req, res) => {
  try {
    const contacts = await adminService.getAllContacts();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subs = await adminService.getAllSubscribers();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
