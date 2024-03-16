import jwt from "jsonwebtoken";
import Cleaner from "../models/CleanerSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
    // Get token from headers
    const authToken = req.headers.authorization;

    // Check if token exists
    if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const token = authToken.split(" ")[1]; // Split by space

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decoded.id;
        req.role = decoded.role;

        next(); // Call the next function
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token is expired" });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const restrict = roles => (req, res, next) => {
    const userRole = req.role;

    if (!roles.includes(userRole)) {
        return res.status(401).json({ success: false, message: "User not authorized" });
    }
    next();
};
