const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔹 Set Uploads Directory (Docker Volume Support)
const resumeUploadPath = process.env.UPLOADS_DIR || path.join(__dirname, "../uploads/resumes");

// 🔹 Ensure Upload Directory Exists
if (!fs.existsSync(resumeUploadPath)) {
  fs.mkdirSync(resumeUploadPath, { recursive: true });
}

// 🔹 Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.session.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 🔹 File Upload Middleware
const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ 5MB Limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    if (!allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error("Only .pdf, .doc, and .docx files are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = uploadResume;
