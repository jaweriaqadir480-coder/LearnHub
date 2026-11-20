const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Enroll Student in Course
const enrollCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can perform this action",
      });
    }

    const { courseId } = req.body;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You are already enrolled in this course",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json({
      message: "Successfully enrolled in course!",
      enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You are already enrolled in this course",
      });
    }

    res.status(500).json({
      message: "Enrollment failed",
      error: error.message,
    });
  }
};

// Get My Enrolled Courses
const getMyCourses = async (req, res) => {
  try {
    if (req.user.role !== "student") {
    return res.status(403).json({
        message: "Only students can access enrolled courses"
    });
}
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({
      student: studentId,
    }).populate("course");

    res.status(200).json({
      message: "My courses fetched successfully",
      courses: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch my courses",
      error: error.message,
    });
  }
};

// Mark Lesson as Completed
const completeLesson = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can perform this action",
      });
    }
    const studentId = req.user.id;
    const { courseId, lessonId } = req.body;

    // Check course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check lesson
    const lesson = course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Please enroll in this course first",
      });
    }

    // Save completed lesson
    await Enrollment.updateOne(
      { _id: enrollment._id },
      { $addToSet: { completedLessons: lessonId } },
    );

    res.status(200).json({
      message: "Lesson completed successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to complete lesson",
      error: error.message,
    });
  }
};

module.exports = {
  enrollCourse,
  getMyCourses,
  completeLesson,
};
