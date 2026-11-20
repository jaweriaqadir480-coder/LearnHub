
const express = require("express");
const router = express.Router();

const {
    getCourses,
    addCourse,
    addLesson
} = require("../controllers/courseController");

const { protect, admin } = require("../middleware/authMiddleware");

// Get All Courses (Public)
router.get("/", getCourses);

// Add New Course (Admin Only)
router.post("/", protect, admin, addCourse);

// Add Lesson (Admin Only)
router.post("/:id/lessons", protect, admin, addLesson);

module.exports = router;
