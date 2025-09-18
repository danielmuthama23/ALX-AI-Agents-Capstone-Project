import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../services/authService';
import { testUsers, loginData, registrationData } from '../fixtures/userData';
import { User } from '../../models/User';

// Mock the User model
jest.mock('../../models/User');

describe('AuthService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = registrationData.valid;
      
      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock User.save to return the new user
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        ...userData,
        save: jest.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          username: userData.username,
          email: userData.email,
          toObject: () => ({ _id: new mongoose.Types.ObjectId(), username: userData.username, email: userData.email })
        })
      };
      
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const result = await AuthService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe(userData.username);
      expect(result.user.email).toBe(userData.email);
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: userData.email }, { username: userData.username }]
      });
    });

    it('should throw error if user already exists', async () => {
      const userData = registrationData.existing;
      
      // Mock User.findOne to return existing user
      (User.findOne as jest.Mock).mockResolvedValue({ email: userData.email });

      await expect(AuthService.register(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginCredentials = loginData.valid;
      const mockUser = {
        _id: testUsers[0]._id,
        email: testUsers[0].email,
        username: testUsers[0].username,
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: () => ({
          _id: testUsers[0]._id,
          email: testUsers[0].email,
          username: testUsers[0].username
        })
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.login(loginCredentials);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(loginCredentials.email);
      expect(User.findOne).toHaveBeenCalledWith({ email: loginCredentials.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginCredentials.password);
    });

    it('should throw error with invalid credentials', async () => {
      const loginCredentials = loginData.invalid;
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(AuthService.login(loginCredentials)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if user not found', async () => {
      const loginCredentials = loginData.nonExistent;

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.login(loginCredentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = testUsers[0]._id!.toString();
      const currentPassword = 'oldPassword';
      const newPassword = 'newPassword123!';
      
      const mockUser = {
        _id: userId,
        comparePassword: jest.fn().mockResolvedValue(true),
        password: 'oldHashedPassword',
        save: jest.fn().mockResolvedValue(true)
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await AuthService.changePassword(userId, currentPassword, newPassword);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(currentPassword);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw error if current password is incorrect', async () => {
      const userId = testUsers[0]._id!.toString();
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.changePassword(userId, 'wrongPassword', 'newPassword123!')
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('verifyToken', () => {
    it('should verify token and return user', async () => {
      const userId = testUsers[0]._id!.toString();
      const token = jwt.sign({ id: userId }, 'test-secret');
      
      const mockUser = {
        _id: userId,
        email: testUsers[0].email,
        username: testUsers[0].username
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.verifyToken(token);

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const token = jwt.sign({ id: userId }, 'test-secret');

      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.verifyToken(token)).rejects.toThrow('User not found');
    });
  });

  describe('checkAvailability', () => {
    it('should return true for available email', async () => {
      const email = 'available@example.com';

      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.checkEmailAvailability(email);

      expect(result).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({ email });
    });

    it('should return false for taken email', async () => {
      const email = 'taken@example.com';

      (User.findOne as jest.Mock).mockResolvedValue({ email });

      const result = await AuthService.checkEmailAvailability(email);

      expect(result).toBe(false);
    });
  });
});