
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    videoUrl: {
        type: String,
        default: ""
    },

    content: {
        type: String,
        default: ""
    }
});

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    instructor: {
        type: String,
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    lessons: [lessonSchema]

}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
