
const mongoose = require("mongoose");

// Create User Schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
    type: String,
    enum: ["student", "admin", "instructor"],
    default: "student"
}

});

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
