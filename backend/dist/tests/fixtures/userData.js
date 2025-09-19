"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestUserTokenData = exports.createTestUser = exports.loginData = exports.registrationData = exports.invalidUsers = exports.testUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.testUsers = [
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'Password123!',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'Password123!',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        username: 'testuser3',
        email: 'test3@example.com',
        password: 'Password123!',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
exports.invalidUsers = [
    {
        username: 'ab',
        email: 'invalid-email',
        password: 'short'
    },
    {
        username: 'test user',
        email: 'test@example.com',
        password: 'Password123!'
    },
    {
        username: 'validuser',
        email: 'invalid-email-format',
        password: 'Password123!'
    }
];
exports.registrationData = {
    valid: {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
    },
    invalid: {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
    },
    existing: {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
    }
};
exports.loginData = {
    valid: {
        email: 'test1@example.com',
        password: 'Password123!'
    },
    invalid: {
        email: 'test1@example.com',
        password: 'WrongPassword123!'
    },
    nonExistent: {
        email: 'nonexistent@example.com',
        password: 'Password123!'
    }
};
const createTestUser = (overrides = {}) => {
    const baseUser = {
        _id: new mongoose_1.default.Types.ObjectId(),
        username: `testuser_${Math.random().toString(36).substring(2, 10)}`,
        email: `test_${Math.random().toString(36).substring(2, 10)}@example.com`,
        password: 'Password123!',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    return { ...baseUser, ...overrides };
};
exports.createTestUser = createTestUser;
const getTestUserTokenData = (user) => {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email
    };
};
exports.getTestUserTokenData = getTestUserTokenData;
//# sourceMappingURL=userData.js.map