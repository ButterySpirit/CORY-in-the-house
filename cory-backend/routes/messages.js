const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Message, User } = require("../models");

// 🔹 GET /messages/inbox - List all conversations of the logged-in user
router.get("/inbox", async (req, res) => {
  try {
    const loggedInUserId = req.session.userId;
    if (!loggedInUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("📬 Fetching inbox for user:", loggedInUserId);

    const messages = await Message.findAll({
      where: {
        roomId: {
          [Op.iLike]: `%${loggedInUserId}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    console.log("🟡 Total messages found:", messages.length);

    const roomMap = new Map();
    messages.forEach((msg) => {
      if (!roomMap.has(msg.roomId)) {
        roomMap.set(msg.roomId, msg);
      }
    });

    const inbox = [];

    for (let [roomId, latestMsg] of roomMap.entries()) {
      const parts = roomId.split("__");
      if (parts.length < 3) continue;

      const otherUserId = parts.find(
        (id) => id !== "direct" && id !== loggedInUserId
      );

      if (!otherUserId) continue;

      const otherUser = await User.findByPk(otherUserId, {
        attributes: ["id", "username", "email"],
      });

      inbox.push({
        roomId,
        participant: otherUser || { username: "Unknown" },
        lastMessage: latestMsg.message,
        lastUpdated: latestMsg.createdAt,
      });
    }

    console.log("📦 Inbox formatted result:", inbox.length);
    res.json(inbox);
  } catch (err) {
    console.error("❌ Inbox Error:", err.stack || err);
    res.status(500).json({ error: "Server error while fetching inbox" });
  }
});

// 🔹 GET /messages/:roomId - Fetch messages for a specific room
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
