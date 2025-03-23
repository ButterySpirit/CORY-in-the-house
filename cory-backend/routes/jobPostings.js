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


    // 🔥 DELETE a specific Job Posting (only by organizer)
router.delete("/:jobId", isOrganizer, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job posting not found." });
    }

    // Optional: Check if the job belongs to an event owned by the current organizer
    const event = await Event.findByPk(job.eventId);
    if (!event || event.organizerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: You can only delete jobs from your own events." });
    }

    await job.destroy();

    res.json({ message: "✅ Job posting deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting job posting:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔧 UPDATE a specific Job Posting (only by organizer)
router.put("/:jobId/edit", isOrganizer, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description, role } = req.body;

    // 🔹 Validate input
    if (!title || !description || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const validRoles = ["volunteer", "staff"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    }

    // 🔹 Find job
    const job = await JobPosting.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job posting not found." });
    }

    // 🔹 Check event ownership
    const event = await Event.findByPk(job.eventId);
    if (!event || event.organizerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: You can only edit jobs from your own events." });
    }

    // 🔹 Update job
    job.title = title;
    job.description = description;
    job.role = role.toLowerCase();
    await job.save();

    res.json({ message: "✅ Job posting updated successfully.", job });
  } catch (err) {
    console.error("❌ Error updating job posting:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔹 GET a single job posting by ID
router.get("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await JobPosting.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    res.json(job);
  } catch (err) {
    console.error("❌ Error fetching job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

    // ✅ Fetch job postings with filter
    const jobPostings = await JobPosting.findAll({ where: filter });

    if (jobPostings.length === 0) {
      return res.status(404).json({ error: "No job postings found for this event and role." });
    }

    res.json(jobPostings);
  } catch (err) {
    console.error("❌ Error fetching job postings:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
