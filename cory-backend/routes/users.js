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

    // ❌ Don't hash the password manually (Sequelize hooks do this already!)
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

// 🔹 **Retrieve Logged-In User Session**
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
      where: { id: { [Op.eq]: req.session.userId } },
      attributes: ["id", "username", "email", "role"], // ✅ Ensure role is included
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

// 🔹 **Login Route - Store Valid UUID in Session**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (use the scope that includes the password!)
    const user = await User.scope("withPassword").findOne({ where: { email } });

    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Compare password with the hashed version
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match for user:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Store UUID in session
    req.session.userId = user.id;
    console.log("✅ User logged in:", user.id);

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
    console.error("❌ Error fetching users:", err);
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
    console.error("❌ Error fetching user:", err);
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
    console.error("❌ Error deleting user:", err);
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
    console.error("❌ Error updating role:", err);
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
    console.error("❌ Error updating rating:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
