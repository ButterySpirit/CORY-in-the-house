require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { sequelize } = require("./models"); // Import Sequelize instance
const userRoutes = require("./routes/users"); // User routes
const eventRoutes = require("./routes/events"); // Event routes
const jobPostingRoutes = require("./routes/jobPostings"); // Job Posting routes
const jobApplicationRoutes = require("./routes/jobApplications"); // ✅ Job Application routes

const app = express();

// 🔹 Use Sessions to Track Logged-In Users
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // ✅ Uses environment variable for security
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// 🔹 Middleware
app.use(express.json()); // ✅ Parses JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Supports URL-encoded form data

// 🔹 Serve Resume Files for Download
app.use("/uploads/resumes", express.static(path.join(__dirname, "uploads/resumes"))); // ✅ Serve resumes


// 🔹 Test Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CORY Backend!" });
});

// 🔹 Middleware to Log Session Data (For Debugging)
app.use((req, res, next) => {
  console.log("🛠️ Session Data:", req.session);
  next();
});

// 🔹 Integrate API Routes
app.use("/users", userRoutes); // Handles user-related actions
app.use("/events", eventRoutes); // Handles event creation
app.use("/jobPostings", jobPostingRoutes); // ✅ Job postings have a separate route
app.use("/applications", jobApplicationRoutes); // ✅ Integrate Job Application Routes

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
