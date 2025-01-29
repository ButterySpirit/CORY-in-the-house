const express = require("express");
const { JobPosting, Event } = require("../models");
const { isOrganizer } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Organizer Adds a Job Posting to an Event
router.post("/:eventId/jobs", isOrganizer, async (req, res) => {
  try {
    const { title, description, role } = req.body;
    const { eventId } = req.params;

    // ✅ Validate role type
    if (!["volunteer", "staff"].includes(role.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role type. Must be 'volunteer' or 'staff'." });
    }

    // ✅ Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Create job posting
    const jobPosting = await JobPosting.create({
      title,
      description,
      role: role.toLowerCase(), // Store role in lowercase for consistency
      eventId,
    });

    res.status(201).json(jobPosting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get All Job Postings for an Event (with optional role filter)
router.get("/:eventId/jobs", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { role } = req.query; // Capture role from query params

    // ✅ Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Build filter criteria (optional role filtering)
    const filter = { eventId };
    if (role) {
      const normalizedRole = role.toLowerCase();
      if (!["volunteer", "staff"].includes(normalizedRole)) {
        return res.status(400).json({ error: "Invalid role type. Must be 'volunteer' or 'staff'." });
      }
      filter.role = normalizedRole;
    }

    // ✅ Fetch job postings with filter
    const jobPostings = await JobPosting.findAll({ where: filter });

    if (jobPostings.length === 0) {
      return res.status(404).json({ error: "No job postings found for this event and role." });
    }

    res.json(jobPostings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
