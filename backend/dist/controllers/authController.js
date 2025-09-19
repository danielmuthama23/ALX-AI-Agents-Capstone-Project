"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const validation_1 = require("../middleware/validation");
const register = async (req, res) => {
    try {
        const { error } = (0, validation_1.validateRegistration)(req.body);
        if (error) {
            res.status(400).json({
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const { username, email, password } = req.body;
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            res.status(409).json({
                message: 'User already exists with this email or username'
            });
            return;
        }
        const user = new User_1.default({
            username,
            email,
            password
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { error } = (0, validation_1.validateLogin)(req.body);
        if (error) {
            res.status(400).json({
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: error.message
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;
        if (email || username) {
            const existingUser = await User_1.default.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    { $or: [{ email }, { username }] }
                ]
            });
            if (existingUser) {
                res.status(409).json({
                    message: 'Email or username already taken'
                });
                return;
            }
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { username, email }, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Current password and new password are required' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ message: 'New password must be at least 6 characters long' });
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.changePassword = changePassword;
const logout = async (req, res) => {
    try {
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map