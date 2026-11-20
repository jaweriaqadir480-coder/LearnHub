
const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
    addCourse,
    updateCourse,
    deleteCourse,
    addLesson
} = require("../controllers/courseController");

// All routes are Admin Only
router.use(protect, admin);

// Admin Dashboard
router.get("/dashboard", (req, res) => {
    res.json({
        message: "Welcome to Admin Dashboard",
        user: req.user
    });
});

// Add Course
router.post("/courses", addCourse);

// Update Course
router.put("/courses/:id", updateCourse);

// Delete Course
router.delete("/courses/:id", deleteCourse);

// Add Lesson
router.post("/courses/:id/lessons", addLesson);

module.exports = router;
