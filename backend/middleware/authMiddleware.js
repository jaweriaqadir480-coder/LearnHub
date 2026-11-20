
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed"
        });
    }
};


// Admin Only Middleware
const admin = (req, res, next) => {

    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

};

// Instructor and Admin Access
const instructorOrAdmin = (req, res, next) => {

    if (
        req.user &&
        (req.user.role === "instructor" || req.user.role === "admin")
    ) {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied. Instructor or Admin only."
        });
    }

};
// Instructor Only Middleware
const instructor = (req, res, next) => {

    if (
        req.user &&
        (req.user.role === "instructor" || req.user.role === "admin")
    ) {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied. Instructor only."
        });
    }

};
module.exports = {
    protect,
    admin,
    instructor
};