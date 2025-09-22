"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeAgo = exports.formatFileSize = exports.generateSlug = exports.isStrongPassword = exports.isEmail = exports.deepClone = exports.throttle = exports.debounce = exports.getClientIp = exports.calculateDueDate = exports.formatDate = exports.sanitizeInput = exports.generateRandomString = exports.validateObjectId = exports.getPagination = exports.errorResponse = exports.successResponse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const successResponse = (message, data, pagination) => {
    const response = {
        success: true,
        message
    };
    if (data !== undefined) {
        response.data = data;
    }
    if (pagination !== undefined) {
        response.pagination = pagination;
    }
    return response;
};
exports.successResponse = successResponse;
const errorResponse = (message, errors) => {
    const response = {
        success: false,
        message
    };
    if (errors !== undefined) {
        response.errors = errors;
    }
    return response;
};
exports.errorResponse = errorResponse;
const getPagination = (page = 1, limit = 10, total = 0) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page: Math.max(1, Math.min(page, totalPages)),
        limit: Math.max(1, Math.min(limit, 100)),
        total,
        totalPages
    };
};
exports.getPagination = getPagination;
const validateObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
exports.validateObjectId = validateObjectId;
const generateRandomString = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const sanitizeInput = (input) => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};
exports.sanitizeInput = sanitizeInput;
const formatDate = (date, format = 'YYYY-MM-DD') => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};
exports.formatDate = formatDate;
const calculateDueDate = (priority) => {
    const now = new Date();
    switch (priority) {
        case 'high':
            return new Date(now.setDate(now.getDate() + 1));
        case 'medium':
            return new Date(now.setDate(now.getDate() + 3));
        case 'low':
            return new Date(now.setDate(now.getDate() + 7));
        default:
            return new Date(now.setDate(now.getDate() + 3));
    }
};
exports.calculateDueDate = calculateDueDate;
const getClientIp = (req) => {
    return req.ip ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        (req.connection?.socket ? req.connection.socket.remoteAddress : '') ||
        'unknown';
};
exports.getClientIp = getClientIp;
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), wait);
    };
};
exports.debounce = debounce;
const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
exports.throttle = throttle;
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(item => (0, exports.deepClone)(item));
    }
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = (0, exports.deepClone)(obj[key]);
        });
        return cloned;
    }
    return obj;
};
exports.deepClone = deepClone;
const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isEmail = isEmail;
const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};
exports.isStrongPassword = isStrongPassword;
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .substring(0, 50);
};
exports.generateSlug = generateSlug;
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
exports.formatFileSize = formatFileSize;
const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} days ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} months ago`;
    }
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
};
exports.getTimeAgo = getTimeAgo;
//# sourceMappingURL=helpers.js.map