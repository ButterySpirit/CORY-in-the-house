const { User } = require("../models");

// 🔹 Check if User is Logged In
const isUser = async (req, res, next) => {
  try {
    console.log("🔍 Checking stored User ID in Session:", req.session.userId);

    if (!req.session.userId) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // ✅ Attach user to request
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Check if User is an Organizer
const isOrganizer = async (req, res, next) => {
  try {
    console.log("🔍 Checking stored User ID in Session:", req.session.userId);

    if (!req.session.userId) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "organizer") {
      return res.status(403).json({ error: "Only organizers can perform this action" });
    }

    req.user = user; // ✅ Attach user to request
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { isUser, isOrganizer };