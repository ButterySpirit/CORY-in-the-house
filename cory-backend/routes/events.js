// routes/events.js

const express = require("express");
const { Sequelize } = require("sequelize");
const { Event, User, JobPosting } = require("../models");
const { isOrganizer } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Create Event (Organizer only)
router.post("/", isOrganizer, async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.session.userId,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Get All Events (Public) with Job Count
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: JobPosting,
          as: "jobPostings",
          attributes: [], // we don’t need the full data
        },
        {
          model: User,
          attributes: ["id", "username", "email", "role"],
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("jobPostings.id")), "jobCount"]
        ],
      },
      group: ["Event.id", "User.id"],
    });

    res.json(events.map((event) => ({
      ...event.toJSON(),
      jobCount: parseInt(event.get("jobCount") || 0),
    })));

  } catch (err) {
    console.error("❌ Failed to fetch events with job counts:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 🔹 Get Events Created by Logged-In Organizer
router.get("/my-events", isOrganizer, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { organizerId: req.session.userId },
      include: [
        {
          model: JobPosting,
          as: "jobPostings",
          attributes: [], // we don’t need the full data
        },
        {
          model: User,
          attributes: ["id", "username", "email", "role"],
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("jobPostings.id")), "jobCount"],
        ],
      },
      group: ["Event.id", "User.id"],
    });

    res.json(events.map((event) => ({
      ...event.toJSON(),
      jobCount: parseInt(event.get("jobCount") || 0),
    })));    

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get Single Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "username", "email", "role"],
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update Event (Only Organizer)
router.put("/:id", isOrganizer, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.organizerId !== req.session.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await event.update(req.body);
    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete Event (Only Organizer)
router.delete("/:id", isOrganizer, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.organizerId !== req.session.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
