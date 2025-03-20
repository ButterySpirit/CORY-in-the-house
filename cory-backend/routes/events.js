const express = require("express");
const router = express.Router();
const { Event, User } = require("../models");
const { isOrganizer } = require("../middlewares/authMiddleware");

// 🔹 Organizer creates an event
router.post("/", isOrganizer, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "You must be logged in to create an event" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      organizerId: req.user.id
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all events with organizer details
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      include: {
        model: User,
        attributes: ["id", "username", "email", "role"], // ✅ Hide sensitive data
      }
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all events created by the logged-in organizer
router.get("/my-events", isOrganizer, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { organizerId: req.user.id },
      include: {
        model: User,
        attributes: ["id", "username", "email", "role"], // ✅ Hide sensitive data
      }
    });

    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching organizer's events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get a specific event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "username", "email", "role"], // ✅ Hide sensitive data
      }
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete an event (Only the Organizer who created it can delete it)
router.delete("/:id", isOrganizer, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Only the organizer who created the event can delete it
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ error: "You can only delete events you created" });
    }

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Edit an event (Only the Organizer who created it can edit it)
router.put("/:id", isOrganizer, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Only allow the event's organizer to edit
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ error: "You can only edit events you created" });
    }

    // ✅ Update event
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
