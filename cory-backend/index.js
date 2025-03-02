require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const jobPostingRoutes = require("./routes/jobPostings");
const jobApplicationRoutes = require("./routes/jobApplications");

const app = express();

/* ==========================
✅ FORCE CORS HEADERS
========================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* ==========================
✅ ENABLE CORS MIDDLEWARE
========================== */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* ==========================
✅ EXPRESS MIDDLEWARE
========================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================
✅ SESSION HANDLING
========================== */
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

/* ==========================
✅ STATIC FILES
========================== */
app.use("/uploads/resumes", express.static(path.join(__dirname, "uploads/resumes")));

/* ==========================
✅ LOGGING REQUESTS
========================== */
app.use((req, res, next) => {
  console.log(`📢 ${req.method} ${req.url}`);
  console.log("🛠️ Session Data:", req.session);
  next();
});

/* ==========================
✅ ROUTES
========================== */
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/jobPostings", jobPostingRoutes);
app.use("/applications", jobApplicationRoutes);

/* ==========================
✅ FORCE OPTIONS REQUESTS TO RESPOND
========================== */
app.options("*", (req, res) => {
  res.sendStatus(200);
});

/* ==========================
✅ START SERVER
========================== */
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

startServer();
