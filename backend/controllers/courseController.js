
const Course = require("../models/Course");

// Get All Courses
const getCourses = async (req, res) => {
    try {

        const courses = await Course.find();

        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch courses"
        });
    }
};

// Add New Course
const addCourse = async (req, res) => {
    try {

        const {
            title,
            description,
            instructor,
            duration,
            category,
            lessons
        } = req.body;

        const course = await Course.create({
            title,
            description,
            instructor,
            duration,
            category,
            lessons: lessons || []
        });

        res.status(201).json({
            message: "Course added successfully",
            course
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to add course",
            error: error.message
        });
    }
};
// Add Lesson to Course
const addLesson = async (req, res) => {
    try {

        const { title, description, videoUrl, content } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        course.lessons.push({
            title,
            description,
            videoUrl,
            content
        });

        await course.save();

        res.status(201).json({
            message: "Lesson added successfully",
            course
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to add lesson",
            error: error.message
        });
    }
};

// Update Course
const updateCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            instructor,
            duration,
            category,
            lessons
        } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (instructor !== undefined) course.instructor = instructor;
        if (duration !== undefined) course.duration = duration;
        if (category !== undefined) course.category = category;
        if (lessons !== undefined) course.lessons = lessons;

        await course.save();

        res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to update course",
            error: error.message
        });
    }
};


// Delete Course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        await course.deleteOne();

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete course",
            error: error.message
        });
    }
};

module.exports = {
    getCourses,
    addCourse,
    addLesson,
    updateCourse,
    deleteCourse
};
