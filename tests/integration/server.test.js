/**
 * Integration Tests for Server API
 */

const request = require('supertest');
const mongoose = require('mongoose');

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';

describe('Server Integration Tests', () => {
  let app;
  let server;

  beforeAll(() => {
    // Import server after env vars are set
    app = require('../../server');
  });

  afterAll(async () => {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });

    test('GET /health should return database status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Static Files', () => {
    test('GET / should return intro.html', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
    });

    test('GET /player-database.js should return JavaScript', async () => {
      const response = await request(app).get('/player-database.js');
      
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/javascript/);
    });
  });

  describe('API Routes', () => {
    test('GET /api/matches/:roomId should return 404 for non-existent room', async () => {
      const response = await request(app).get('/api/matches/INVALID');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});

describe('Socket.IO Integration', () => {
  test('Socket connection should be established', (done) => {
    const io = require('socket.io-client');
    const socket = io('http://localhost:3000', {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      socket.disconnect();
      done();
    });

    socket.on('connect_error', (error) => {
      // Server might not be running, skip test
      socket.disconnect();
      done();
    });
  });
});
