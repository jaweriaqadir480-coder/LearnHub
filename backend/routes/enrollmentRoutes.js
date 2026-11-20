
const express = require("express");
const router = express.Router();

const {
    enrollCourse,
    getMyCourses,
    completeLesson
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");

// Enroll in a course
router.post("/", protect, enrollCourse);

// Get My Enrolled Courses
router.get("/my-courses", protect, getMyCourses);

// Complete a Lesson
router.post("/complete-lesson", protect, completeLesson);

module.exports = router;
