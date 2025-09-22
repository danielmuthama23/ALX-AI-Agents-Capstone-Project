import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * @interface ValidationError
 * @description Custom validation error interface
 */
interface ValidationError {
  field: string;
  message: string;
}

/**
 * @function validateRequest
 * @description Generic request validation middleware
 */
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map(detail => ({
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

    // Replace req.body with the validated value
    req.body = value;
    next();
  };
};

/**
 * Validation schemas
 */
export const validateRegistration = validateRequest(Joi.object({
  username: Joi.string()
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
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
}));

export const validateLogin = validateRequest(Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
}));

export const validateTask = validateRequest(Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  dueDate: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Due date must be in the future'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
  category: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Category cannot exceed 50 characters'
    }),
  completed: Joi.boolean()
    .optional()
}));

export const validateProfileUpdate = validateRequest(Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    })
}));

export const validatePasswordChange = validateRequest(Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your new password'
    })
}));

/**
 * @function validateObjectId
 * @description Validate MongoDB ObjectId in URL parameters
 */
export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
    return;
  }
  
  next();
};

/**
 * @function validateQueryParams
 * @description Validate common query parameters
 */
export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
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