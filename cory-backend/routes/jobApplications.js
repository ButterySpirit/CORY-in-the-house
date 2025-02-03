const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { JobApplication, User, JobPosting } = require("../models");
const { isUser, isOrganizer } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Ensure `uploads/resumes` directory exists
const resumeUploadPath = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(resumeUploadPath)) {
  fs.mkdirSync(resumeUploadPath, { recursive: true });
}

// 🔹 Configure Multer for Resume Uploads
const storage = multer.diskStorage({
  destination: resumeUploadPath,
  filename: (req, file, cb) => {
    cb(null, `${req.session.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    if (!allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error("Only .pdf, .doc, and .docx files are allowed!"));
    }
    cb(null, true);
  },
});

// 🔹 Apply for a Job Posting (Resume Required for Staff Jobs)
router.post("/:jobPostingId/apply", isUser, upload.single("resume"), async (req, res) => {
  try {
    const { jobPostingId } = req.params;
    const userId = req.session.userId;

    // ✅ Check if the job exists
    const jobPosting = await JobPosting.findByPk(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    // ✅ Prevent Duplicate Applications
    const existingApplication = await JobApplication.findOne({ where: { jobPostingId, userId } });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    // ✅ Require Resume for Staff Jobs
    let resumePath = null;
    if (jobPosting.role === "staff") {
      if (!req.file) {
        return res.status(400).json({ error: "A resume is required for staff applications." });
      }
      resumePath = `/uploads/resumes/${req.file.filename}`;
    }

    // ✅ Create Job Application
    const jobApplication = await JobApplication.create({
      userId,
      jobPostingId,
      status: "pending",
      resume: resumePath, // ✅ Store resume path in database
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
