
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const enrollmentRoutes = require("./routes/enrollmentRoutes");
// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Course Routes
app.use("/api/courses", courseRoutes);

// Enrollment Routes
app.use("/api/enrollments", enrollmentRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Instructor Routes
app.use("/api/instructor", instructorRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("LearnHub API is running...");
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`LearnHub server running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Server startup failed:", error.message);
    }
};

startServer();
