import mongoose from 'mongoose';
// import { IUser } from '../../models/User'; // Unused import

/**
 * @interface TestUser
 * @description Interface for test user data
 */
export interface TestUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @constant testUsers
 * @description Test user data for unit and integration tests
 */
export const testUsers: TestUser[] = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser1',
    email: 'test1@example.com',
    password: 'Password123!',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'Password123!',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser3',
    email: 'test3@example.com',
    password: 'Password123!',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * @constant invalidUsers
 * @description Invalid user data for validation tests
 */
export const invalidUsers = [
  {
    username: 'ab', // Too short
    email: 'invalid-email',
    password: 'short'
  },
  {
    username: 'test user', // Contains space
    email: 'test@example.com',
    password: 'Password123!'
  },
  {
    username: 'validuser',
    email: 'invalid-email-format',
    password: 'Password123!'
  }
];

/**
 * @constant registrationData
 * @description User registration test data
 */
export const registrationData = {
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
    username: 'testuser1', // Already exists
    email: 'test1@example.com', // Already exists
    password: 'Password123!',
    confirmPassword: 'Password123!'
  }
};

/**
 * @constant loginData
 * @description User login test data
 */
export const loginData = {
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

/**
 * @function createTestUser
 * @description Create a test user object
 */
export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => {
  const baseUser: TestUser = {
    _id: new mongoose.Types.ObjectId(),
    username: `testuser_${Math.random().toString(36).substring(2, 10)}`,
    email: `test_${Math.random().toString(36).substring(2, 10)}@example.com`,
    password: 'Password123!',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return { ...baseUser, ...overrides };
};

/**
 * @function getTestUserTokenData
 * @description Get user data for token generation
 */
export const getTestUserTokenData = (user: TestUser) => {
  return {
    id: user._id!.toString(),
    username: user.username,
    email: user.email
  };
};