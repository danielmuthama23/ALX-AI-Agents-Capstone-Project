import User, { IUser } from '../models/User';
import { generateToken, verifyToken } from '../middleware/auth';

/**
 * @class AuthService
 * @description Service layer for authentication operations
 */
export class AuthService {
  /**
   * @method register
   * @description Register a new user
   */
  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });

      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate token
      const token = generateToken(user._id.toString());

      return { user, token };
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method login
   * @description Login user with email and password
   */
  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    try {
      // Find user by email
      const user = await User.findOne({ email: credentials.email }).select('+password');
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Remove password from user object
      const userObj = user.toObject();
      const { password, ...userWithoutPassword } = userObj;

      // Generate token
      const token = generateToken(user._id.toString());

      return { user: userWithoutPassword as IUser, token };
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method changePassword
   * @description Change user password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();
    } catch (error) {
      throw new Error(`Password change failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method verifyToken
   * @description Verify JWT token and return user
   */
  static async verifyToken(token: string): Promise<IUser> {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Token verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method refreshToken
   * @description Refresh JWT token
   */
  static async refreshToken(userId: string): Promise<string> {
    try {
      return generateToken(userId);
    } catch (error) {
      throw new Error(`Token refresh failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method checkEmailAvailability
   * @description Check if email is available
   */
  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const existingUser = await User.findOne({ email });
      return !existingUser;
    } catch (error) {
      throw new Error(`Email availability check failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method checkUsernameAvailability
   * @description Check if username is available
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const existingUser = await User.findOne({ username });
      return !existingUser;
    } catch (error) {
      throw new Error(`Username availability check failed: ${(error as Error).message}`);
    }
  }
}