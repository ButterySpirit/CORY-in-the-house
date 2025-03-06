const express = require("express");
const { JobPosting, Event } = require("../models");
const { isOrganizer } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Organizer Adds a Job Posting to an Event (✅ Now uses `/create`)
router.post("/:eventId/jobs/create", isOrganizer, async (req, res) => {
  try {
    const { title, description, role } = req.body;
    const { eventId } = req.params;

    // ✅ Validate role type (ensure it matches ENUM case in DB)
    const validRoles = ["volunteer", "staff"];
    if (!role || !validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ error: `Invalid role type. Must be one of: ${validRoles.join(", ")}` });
    }

    // ✅ Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found. Cannot add job posting." });
    }

    // ✅ Ensure only the event organizer can create jobs
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: Only the event organizer can create job postings." });
    }

    // ✅ Create job posting
    const jobPosting = await JobPosting.create({
      title,
      description,
      role: role.toLowerCase(), // Ensure consistent case
      eventId,
    });

    res.status(201).json({
      message: "✅ Job posting created successfully!",
      jobPosting,
    });
  } catch (err) {
    console.error("❌ Error creating job posting:", err);
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
      return res.status(404).json({ error: "Event not found. Cannot retrieve job postings." });
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

    res.json({
      message: "✅ Job postings retrieved successfully!",
      jobPostings,
    });
  } catch (err) {
    console.error("❌ Error fetching job postings:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
