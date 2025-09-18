import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { connectDB, disconnectDB } from '../../config/database';
import { User } from '../../models/User';
import { testUsers, registrationData, loginData } from '../fixtures/userData';

describe('Auth API - Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(registrationData.valid)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(registrationData.valid.email);
    });

    it('should return 409 if user already exists', async () => {
      // First create a user
      await User.create(testUsers[0]);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: testUsers[0].username,
          email: testUsers[0].email,
          password: 'Password123!',
          confirmPassword: 'Password123!'
        })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 for invalid registration data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab', // Too short
          email: 'invalid-email',
          password: 'short',
          confirmPassword: 'different' // Doesn't match
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await User.create(testUsers[0]);
    });

    it('should login user successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData.valid)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.valid.email);
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData.invalid)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData.nonExistent)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create user and get token
      const user = await User.create(testUsers[0]);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData.valid);

      authToken = loginResponse.body.token;
    });

    it('should return current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUsers[0].email);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create user and get token
      const user = await User.create(testUsers[0]);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData.valid);

      authToken = loginResponse.body.token;
    });

    it('should update user profile successfully', async () => {
      const updateData = { username: 'updatedusername' };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.username).toBe(updateData.username);
    });

    it('should return 409 if username is already taken', async () => {
      // Create another user
      await User.create(testUsers[1]);

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: testUsers[1].username })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already taken');
    });
  });
});