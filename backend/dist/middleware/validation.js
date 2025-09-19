"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryParams = exports.validateObjectId = exports.validatePasswordChange = exports.validateProfileUpdate = exports.validateTask = exports.validateLogin = exports.validateRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const validationErrors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }
        req.body = value;
        next();
    };
};
exports.validateRegistration = validateRequest(joi_1.default.object({
    username: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your password'
    })
}));
exports.validateLogin = validateRequest(joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Password is required'
    })
}));
exports.validateTask = validateRequest(joi_1.default.object({
    title: joi_1.default.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
        'string.min': 'Title must be at least 1 character long',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
    }),
    description: joi_1.default.string()
        .trim()
        .max(1000)
        .allow('')
        .optional()
        .messages({
        'string.max': 'Description cannot exceed 1000 characters'
    }),
    dueDate: joi_1.default.date()
        .min('now')
        .optional()
        .messages({
        'date.min': 'Due date must be in the future'
    }),
    priority: joi_1.default.string()
        .valid('low', 'medium', 'high')
        .optional()
        .messages({
        'any.only': 'Priority must be one of: low, medium, high'
    }),
    category: joi_1.default.string()
        .trim()
        .max(50)
        .optional()
        .messages({
        'string.max': 'Category cannot exceed 50 characters'
    }),
    completed: joi_1.default.boolean()
        .optional()
}));
exports.validateProfileUpdate = validateRequest(joi_1.default.object({
    username: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters'
    }),
    email: joi_1.default.string()
        .email()
        .optional()
        .messages({
        'string.email': 'Please provide a valid email address'
    })
}));
exports.validatePasswordChange = validateRequest(joi_1.default.object({
    currentPassword: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Current password is required'
    }),
    newPassword: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required'
    }),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your new password'
    })
}));
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
        return;
    }
    next();
};
exports.validateObjectId = validateObjectId;
const validateQueryParams = (req, res, next) => {
    const { page, limit } = req.query;
    if (page && isNaN(Number(page))) {
        res.status(400).json({
            success: false,
            message: 'Page must be a number'
        });
        return;
    }
    if (limit && isNaN(Number(limit))) {
        res.status(400).json({
            success: false,
            message: 'Limit must be a number'
        });
        return;
    }
    next();
};
exports.validateQueryParams = validateQueryParams;
//# sourceMappingURL=validation.js.map