const express = require("express");
const router = express.Router();
const { Message, User } = require("../models");

router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log("📥 Received request for messages in room:", roomId);

    const messages = await Message.findAll({
      where: { roomId },
      order: [["createdAt", "ASC"]],
      include: {
        model: User,
        attributes: ["username"],
      },
    });

    console.log("✅ Messages fetched:", messages.length);
    const formatted = messages.map((msg) => ({
      message: msg.content,
      sender: msg.User?.username || "Unknown",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error in GET /messages/:roomId:", err.stack || err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

module.exports = router;
