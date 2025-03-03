const express = require("express");
const bcryptjs = require("bcryptjs");
const { Op } = require("sequelize"); // ✅ Import Sequelize operators
const { validate: isUUID } = require("uuid"); // ✅ Import UUID validation
const { User } = require("../models"); // Import User model

const router = express.Router();

// 🔹 **Create a New User with Role Selection**
router.post("/", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // ✅ Ensure role is valid if provided
    const validRoles = ["organizer", "volunteer", "staff"];
    const userRole = validRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : "volunteer";

    // ✅ Hash the password before saving
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role: userRole });

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
    res.status(400).json({ error: err.message });
  }
});

// 🔹 **Fix: Session Route - Retrieve Logged-In User**
router.get("/session", async (req, res) => {
  try {
    if (!req.session.userId) {
      console.log("❌ No user logged in");
      return res.json({ user: null });
    }

    console.log("🔍 Checking session userId:", req.session.userId);

    // ✅ Validate that `req.session.userId` is a valid UUID
    if (!isUUID(req.session.userId)) {
      console.error("❌ Invalid session userId format:", req.session.userId);
      return res.status(400).json({ error: "Invalid session format" });
    }

    const user = await User.findOne({
      where: { id: { [Op.eq]: req.session.userId } }, // ✅ Ensure UUID check
    });

    if (!user) {
      console.log("❌ User not found in session:", req.session.userId);
      return res.json({ user: null });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Session Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 **Fix: Login Route - Store Valid UUID in Session**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Store UUID in session
    req.session.userId = user.id;
    console.log("✅ Storing logged-in User ID in session:", req.session.userId);

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
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 **Logout - Clear User Session**
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.json({ message: "Logout successful" });
  });
});

// 🔹 **Get All Users**
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 **Get a User by ID**
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 **Delete a User**
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 **Update User Role**
router.put("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["organizer", "volunteer", "staff"].includes(role.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role.toLowerCase();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 **Update User Rating**
router.put("/:id/rating", async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating value." });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.rating = rating;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
