import User from "../models/UserSchema.js";
import Cleaner from "../models/CleanerSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = user => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    });
};

export const register = async (req, res) => {
    const { email, password, name, address, phone, photo, role, gender } = req.body;

    try {
        let user = null;

        if (role === 'client') {
            user = await User.findOne({ email });
        } else if (role === 'cleaner') {
            user = await Cleaner.findOne({ email });
        }

        // Check if user exists
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        if (role === 'client') {
            user = new User({
                name,
                email,
                password: hashPassword,
                address,
                phone,
                photo,
                gender,
                role
            });
        } else if (role === 'cleaner') {
            user = new Cleaner({
                name,
                email,
                password: hashPassword,
                address,
                phone,
                photo,
                gender,
                role
            });
        }

        await user.save();

        res.status(200)
            .json({ success: true, message: 'User successfully created' });

    } catch (err) {
        console.error(err);
        res.status(500)
            .json({ success: false, message: 'Internal server error. Try again' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = null;

        const client = await User.findOne({ email });
        const cleaner = await Cleaner.findOne({ email });

        if (client) {
            user = client;
        } else if (cleaner) {
            user = cleaner;
        }

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }

        // Generate token
        const token = generateToken(user);

        // Extract necessary data from user object
        const { password: _, role, ...userData } = user.toObject();

        res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            data: userData,
            role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Login unsuccessful" });
    }
};
