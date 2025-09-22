"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
class AuthService {
    static async register(userData) {
        try {
            const existingUser = await User_1.default.findOne({
                $or: [{ email: userData.email }, { username: userData.username }]
            });
            if (existingUser) {
                throw new Error('User already exists with this email or username');
            }
            const user = new User_1.default(userData);
            await user.save();
            const token = (0, auth_1.generateToken)(user._id.toString());
            return { user, token };
        }
        catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }
    static async login(credentials) {
        try {
            const user = await User_1.default.findOne({ email: credentials.email }).select('+password');
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const isPasswordValid = await user.comparePassword(credentials.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            const userObj = user.toObject();
            const { password, ...userWithoutPassword } = userObj;
            const token = (0, auth_1.generateToken)(user._id.toString());
            return { user: userWithoutPassword, token };
        }
        catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User_1.default.findById(userId).select('+password');
            if (!user) {
                throw new Error('User not found');
            }
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            user.password = newPassword;
            await user.save();
        }
        catch (error) {
            throw new Error(`Password change failed: ${error.message}`);
        }
    }
    static async verifyToken(token) {
        try {
            const decoded = (0, auth_1.verifyToken)(token);
            const user = await User_1.default.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            throw new Error(`Token verification failed: ${error.message}`);
        }
    }
    static async refreshToken(userId) {
        try {
            return (0, auth_1.generateToken)(userId);
        }
        catch (error) {
            throw new Error(`Token refresh failed: ${error.message}`);
        }
    }
    static async checkEmailAvailability(email) {
        try {
            const existingUser = await User_1.default.findOne({ email });
            return !existingUser;
        }
        catch (error) {
            throw new Error(`Email availability check failed: ${error.message}`);
        }
    }
    static async checkUsernameAvailability(username) {
        try {
            const existingUser = await User_1.default.findOne({ username });
            return !existingUser;
        }
        catch (error) {
            throw new Error(`Username availability check failed: ${error.message}`);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map