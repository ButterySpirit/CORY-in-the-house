const express = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models"); // Import User model

const router = express.Router();

// 🔹 Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create the user and hash the password (handled in hooks)
    const user = await User.create({ username, email, password });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      rating: user.rating,
      usedLinks: user.usedLinks,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get a specific user by ID
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

// 🔹 Delete a user by ID
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

// 🔹 User login (Store User ID in Session)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🔹 Store user ID in session
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
    res.status(500).json({ error: err.message });
  }
});



// 🔹 User logout (Clear Session)
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.json({ message: "Logout successful" });
  });
});

// 🔹 Update user role
router.put("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["organizer", "volunteer", "staff"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update user rating
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
