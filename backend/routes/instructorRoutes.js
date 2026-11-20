
const express = require("express");
const router = express.Router();

const { protect, instructor } = require("../middleware/authMiddleware");

const {
    addCourse,
    updateCourse,
    deleteCourse,
    addLesson
} = require("../controllers/courseController");

// Protect all Instructor Routes
router.use(protect, instructor);

// Add Course
router.post("/courses", addCourse);

// Update Course
router.put("/courses/:id", updateCourse);

// Delete Course
router.delete("/courses/:id", deleteCourse);

// Add Lesson
router.post("/courses/:id/lessons", addLesson);

module.exports = router;
