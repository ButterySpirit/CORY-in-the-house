require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const { sequelize, Message } = require("./models");

const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const jobPostingRoutes = require("./routes/jobPostings");
const jobApplicationRoutes = require("./routes/jobApplications");
const messageRoutes = require("./routes/messages"); // ✅ ADDED

const app = express();

/* ==========================
✅ SETUP HTTP + SOCKET.IO
========================== */
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* ==========================
✅ SOCKET.IO LISTENERS
========================== */
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`👥 User ${socket.id} joined room ${room}`);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    console.log("📨 Message received:", data);
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("sendMessage", async ({ roomId, message, sender, senderId }) => {
    try {
      await Message.create({
        roomId,
        content: message,
        senderUsername: sender,
        senderId,
      });

      io.to(roomId).emit("receiveMessage", {
        message,
        sender,
      });

      console.log(`💾 Message saved & broadcasted in room ${roomId}`);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

/* ==========================
✅ CORS HEADERS + MIDDLEWARE
========================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================
✅ SESSION
========================== */
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },
}));

/* ==========================
✅ STATIC FILES + LOGGING
========================== */
app.use("/uploads/resumes", express.static(path.join(__dirname, "uploads/resumes")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/messages", messageRoutes); // ✅ ADDED

/* ==========================
✅ START SERVER
========================== */
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

startServer();
