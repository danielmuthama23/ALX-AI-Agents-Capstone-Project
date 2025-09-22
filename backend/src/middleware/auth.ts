import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

/**
 * @interface AuthRequest
 * @description Extended Request interface for authentication
 */
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * @middleware authenticate
 * @description Middleware to authenticate JWT tokens
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'Token is not valid. User not found.' 
      });
      return;
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token.' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: 'Token expired.' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Server error during authentication.' 
      });
    }
  }
};

/**
 * @middleware optionalAuth
 * @description Middleware that tries to authenticate but doesn't fail if no token is provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }
      const decoded = (jwt.verify as any)(token, secret) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      req.user = user as any;
    }
    
    next();
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};

/**
 * @middleware requireAdmin
 * @description Middleware to require admin privileges (placeholder for future use)
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // This is a placeholder for future admin functionality
  // For now, all authenticated users are treated equally
  
  if (!req.user) {
    res.status(401).json({ 
      success: false,
      message: 'Admin access required.' 
    });
    return;
  }
  
  // In a real application, you would check user roles here
  // if (req.user.role !== 'admin') {
  //   res.status(403).json({ message: 'Admin access required.' });
  //   return;
  // }
  
  next();
};

/**
 * @function generateToken
 * @description Generate JWT token for a user
 */
export const generateToken = (userId: string): string => {
  return (jwt.sign as any)(
    { id: userId },
    process.env.JWT_SECRET as string,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'taskflow-api',
      audience: 'taskflow-users'
    }
  );
};

/**
 * @function verifyToken
 * @description Verify JWT token and return decoded payload
 */
export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
};