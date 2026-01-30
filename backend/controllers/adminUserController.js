const User = require("../models/User");
const bcrypt = require("bcryptjs");



exports.addUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
  return res.status(401).json({
    message: "Unauthorized: Admin not found",
  });
}

    const admin = req.user;

    const { name, email, password, role, organisation_name } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, role are required",
      });
    }

    let finalOrganisation;

    if (admin.organisation_name) {
      finalOrganisation = admin.organisation_name;
    } else {
      if (!organisation_name) {
        return res.status(400).json({
          message: "Organisation name is required",
        });
      }
      finalOrganisation = organisation_name;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      organisation_name: finalOrganisation,
      created_by_admin_id: admin.id,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organisation_name: user.organisation_name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

// 🔥 ADD THIS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { created_by_admin_id: req.user.id },
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "organisation_name",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🔥 ADD THIS
exports.updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;

    const user = await User.findOne({
      where: {
        id: req.params.id,
        created_by_admin_id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.role = role ?? user.role;

    await user.save();
    res.json({
      message: "User updated",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};
