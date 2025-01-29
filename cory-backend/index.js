require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { sequelize } = require("./models"); // Import Sequelize instance
const userRoutes = require("./routes/users"); // User routes
const eventRoutes = require("./routes/events"); // Event routes
const jobPostingRoutes = require("./routes/jobPostings"); // Job Posting routes

const app = express();

// 🔹 Use Sessions to Track Logged-In Users
app.use(
  session({
    secret: "your-secret-key", // Change this to a secure key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// Middleware
app.use(express.json()); // Parse JSON requests

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CORY Backend!" });
});

// 🔹 Middleware to Log Session Data
app.use((req, res, next) => {
  console.log("🛠️ Session Data:", req.session);
  next();
});

// 🔹 Integrate API Routes
app.use("/users", userRoutes); // Handles user-related actions
app.use("/events", eventRoutes); // Handles event creation
app.use("/events", jobPostingRoutes); // ✅ Job postings are under events

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
