const express = require("express");
const cors = require("cors");
// importing auth routes
const authRoutes = require("./src/routes/auth.routes");
// importing course routes
const courseRoutes = require("./src/routes/course.routes");
// importing admin routes
const adminRoutes = require("./src/routes/admin.routes");
// importing enrollment routes
const enrollmentRoutes = require("./src/routes/enrollment.routes");
// importing assignment routes
const assignmentRoutes = require("./src/routes/assignment.routes");
// importing quiz routes
const quizRoutes = require("./src/routes/quiz.routes");
// importing error handling middleware
const errorHandler = require("./src/middlewares/errorMiddleware");
// importing user model to ensure it's registered
const userRoutes = require("./src/routes/user.routes");

const connectDB = require("./src/config/db");

// Connect to database (non-blocking for serverless)
connectDB().catch((err) => {
  console.error("Initial DB connection failed:", err.message);
});

const app = express();

app.use(cors());
// ❌ Buggy middleware removed here so PUT, DELETE, etc. work seamlessly!

app.use(express.json());

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

// health check
app.get("/", (req, res) => {
  res.send("Course Master Backend Running ✅");
});

// mounting routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);

// 404 handler (unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handling middleware
app.use(errorHandler);

module.exports = app;