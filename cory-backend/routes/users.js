const express = require("express");
const bcryptjs = require("bcryptjs");
const { Op } = require("sequelize");
const { validate: isUUID } = require("uuid");
const { User } = require("../models");

const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup for storing profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pfp-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// 🔹 Create New User
router.post("/", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const validRoles = ["organizer", "volunteer", "staff"];
    const userRole = validRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : "volunteer";

    const user = await User.create({ username, email, password, role: userRole });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      rating: user.rating,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Session Route
router.get("/session", async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ user: null });

    if (!isUUID(req.session.userId)) {
      return res.status(400).json({ error: "Invalid session format" });
    }

    const user = await User.findOne({
      where: { id: { [Op.eq]: req.session.userId } },
      attributes: ["id", "username", "email", "role", "profilePicture"],
    });

    if (!user) return res.json({ user: null });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture, // ✅ Add this
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    req.session.userId = user.id;

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Failed to log out" });
    res.json({ message: "Logout successful" });
  });
});

// 🔹 Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete User
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update User Role
router.put("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["organizer", "volunteer", "staff"].includes(role.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role.toLowerCase();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update Rating
router.put("/:id/rating", async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 0 || rating > 5) return res.status(400).json({ error: "Invalid rating value." });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.rating = rating;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Upload/Update Profile Picture
// 🔹 General User Update Route (username, email, and optionally profilePicture)
router.put("/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { username, email } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      user.profilePicture = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
