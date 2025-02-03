const express = require("express");
const { JobApplication, User, JobPosting } = require("../models");
const { isUser, isOrganizer } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Apply for a Job Posting (Only Volunteers & Staff)
router.post("/:jobPostingId/apply", isUser, async (req, res) => {
  try {
    const { jobPostingId } = req.params;
    const userId = req.session.userId; // Get logged-in user ID

    if (!userId) {
      return res.status(401).json({ error: "User must be logged in to apply" });
    }

    // ✅ Check if the Job Posting Exists
    const jobPosting = await JobPosting.findByPk(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    // ✅ Prevent Duplicate Applications
    const existingApplication = await JobApplication.findOne({ where: { jobPostingId, userId } });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    // ✅ Create Job Application
    const jobApplication = await JobApplication.create({
      userId,
      jobPostingId,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted successfully!", jobApplication });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get All Applications for a Job Posting (Organizer Only)
router.get("/:jobPostingId/applications", isOrganizer, async (req, res) => {
  try {
    const { jobPostingId } = req.params;

    const applications = await JobApplication.findAll({
      where: { jobPostingId },
      include: [{ model: User, attributes: ["id", "username", "email"] }],
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get Logged-in User's Applications
router.get("/my-applications", isUser, async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { userId: req.session.userId },
      include: [{ model: JobPosting, attributes: ["id", "title", "description", "role"] }],
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Organizer Updates Application Status
router.put("/:applicationId/status", isOrganizer, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'pending', 'accepted', or 'rejected'." });
    }

    const jobApplication = await JobApplication.findByPk(applicationId);
    if (!jobApplication) {
      return res.status(404).json({ error: "Application not found" });
    }

    jobApplication.status = status;
    await jobApplication.save();

    res.json({ message: "Application status updated!", jobApplication });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
