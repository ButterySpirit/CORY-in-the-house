const express = require("express");
const path = require("path");
const { JobApplication, User, JobPosting } = require("../models");
const { isUser, isOrganizer } = require("../middlewares/authMiddleware");
const uploadResume = require("../middlewares/uploadMiddleware"); // ✅ Import Upload Middleware

const router = express.Router();

// 🔹 Apply for a Job Posting (Resume Required for Staff, Optional for Volunteer)
router.post("/:jobPostingId/apply", isUser, uploadResume.single("resume"), async (req, res) => {
  try {
    const { jobPostingId } = req.params;
    const userId = req.session.userId;

    // ✅ Check if the job exists
    const jobPosting = await JobPosting.findByPk(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    // ✅ Prevent duplicate applications
    const existingApplication = await JobApplication.findOne({ where: { jobPostingId, userId } });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    // ✅ Handle Resume Upload Logic
    let resumePath = null;
    if (jobPosting.role === "staff") {
      if (!req.file) {
        return res.status(400).json({ error: "A resume is required for staff applications." });
      }
      resumePath = `/uploads/resumes/${req.file.filename}`; // ✅ Correctly store resume in `/uploads/resumes/`
    } else if (jobPosting.role === "volunteer" && req.file) {
      resumePath = `/uploads/resumes/${req.file.filename}`;
    }

    // ✅ Create Job Application
    const jobApplication = await JobApplication.create({
      userId,
      jobPostingId,
      status: "pending",
      resume: resumePath || null, // ✅ Resume is optional for volunteers
    });

    res.status(201).json({ message: "Application submitted successfully!", jobApplication });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get All Applications for a Specific Job Posting (Includes Resume URLs)
router.get("/:jobPostingId/applications", isOrganizer, async (req, res) => {
  try {
    const { jobPostingId } = req.params;

    // ✅ Fetch job applications including resume file paths
    const applications = await JobApplication.findAll({
      where: { jobPostingId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });

    // ✅ Modify response to include full resume URLs
    const formattedApplications = applications.map((app) => ({
      id: app.id,
      user: app.User,
      status: app.status,
      resumeUrl: app.resume ? `http://localhost:3000${app.resume}` : null, // ✅ Provide full resume URL
    }));

    res.json(formattedApplications);
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
