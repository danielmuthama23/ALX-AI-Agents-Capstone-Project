"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.requireAdmin = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No valid token provided.'
            });
            return;
        }
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Token is not valid. User not found.'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Server error during authentication.'
            });
        }
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_1.default.findById(decoded.id).select('-password');
            req.user = user || undefined;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Admin access required.'
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'taskflow-api',
        audience: 'taskflow-users'
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map