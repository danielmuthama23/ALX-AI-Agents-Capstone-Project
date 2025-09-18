import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { connectDB, disconnectDB } from '../../config/database';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { testUsers, testTasks } from '../fixtures/userData';

describe('Tasks API - Integration Tests', () => {
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

    // Create test tasks
    const tasksWithUserId = testTasks.map(task => ({
      ...task,
      userId: user._id
    }));
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

  describe('GET /api/tasks', () => {
    it('should return tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toBeDefined();
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThan(0);
    });

    it('should filter tasks by completed status', async () => {
      const response = await request(app)
        .get('/api/tasks?completed=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const completedTasks = response.body.tasks.filter((task: any) => task.completed);
      expect(completedTasks.length).toBe(response.body.tasks.length);
    });

    it('should filter tasks by category', async () => {
      const response = await request(app)
        .get('/api/tasks?category=work')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const workTasks = response.body.tasks.filter((task: any) => task.category === 'work');
      expect(workTasks.length).toBe(response.body.tasks.length);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const newTask = {
        title: 'New Integration Test Task',
        description: 'This is a test task created via API',
        priority: 'high',
        category: 'work'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.userId).toBe(userId);
    });

    it('should return 400 for invalid task data', async () => {
      const invalidTask = {
        title: '', // Empty title
        priority: 'invalid' // Invalid priority
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a specific task', async () => {
      // Get a task ID from the database
      const tasks = await Task.find({ userId });
      const taskId = tasks[0]._id.toString();

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body._id).toBe(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 404 for task belonging to another user', async () => {
      // Create another user and task
      const otherUser = await User.create(testUsers[1]);
      const otherTask = await Task.create({
        title: 'Other User Task',
        priority: 'medium',
        userId: otherUser._id
      });

      const response = await request(app)
        .get(`/api/tasks/${otherTask._id.toString()}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task successfully', async () => {
      const tasks = await Task.find({ userId });
      const taskId = tasks[0]._id.toString();
      const updateData = { title: 'Updated Title', completed: true };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.completed).toBe(updateData.completed);
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      const tasks = await Task.find({ userId });
      const taskId = tasks[0]._id.toString();

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify task is actually deleted
      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull();
    });
  });

  describe('GET /api/tasks/stats/overview', () => {
    it('should return task statistics', async () => {
      const response = await request(app)
        .get('/api/tasks/stats/overview')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.total).toBeDefined();
      expect(response.body.completed).toBeDefined();
      expect(response.body.pending).toBeDefined();
      expect(response.body.insights).toBeDefined();
    });
  });
});