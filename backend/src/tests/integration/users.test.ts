import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { connectDB, disconnectDB } from '../../config/database';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { testUsers, testTasks } from '../fixtures/userData';

describe('Users API - Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create test user
    const user = await User.create(testUsers[0]);
    userId = user._id.toString();

    // Create test tasks for the user
    const tasksWithUserId = testTasks
      .filter(task => task.userId.toString() === userId)
      .map(task => ({ ...task, userId: user._id }));
    
    await Task.insertMany(tasksWithUserId);

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUsers[0].email,
        password: 'Password123!'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile with statistics', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.totalTasks).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/users/profile')
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        username: 'updatedusername',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.username).toBe(updateData.username);
      expect(response.body.user.email).toBe(updateData.email);
    });

    it('should return 409 if email is already taken', async () => {
      // Create another user
      await User.create(testUsers[1]);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: testUsers[1].email })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already taken');
    });
  });

  describe('DELETE /api/users/account', () => {
    it('should delete user account and all tasks', async () => {
      const password = 'Password123!';

      const response = await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify user is deleted
      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();

      // Verify user's tasks are deleted
      const userTasks = await Task.find({ userId });
      expect(userTasks.length).toBe(0);
    });

    it('should return 401 with incorrect password', async () => {
      const response = await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'WrongPassword123!' })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrect');
    });
  });

  describe('GET /api/users/activity', () => {
    it('should return user activity data', async () => {
      const response = await request(app)
        .get('/api/users/activity?days=7')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/export', () => {
    it('should export user data as JSON', async () => {
      const response = await request(app)
        .get('/api/users/export')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect('Content-Disposition', /attachment/);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.tasks).toBeDefined();
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });
  });
});