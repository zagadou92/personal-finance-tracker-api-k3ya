const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

let client;
let db;
let token;
let userId;

beforeAll(async () => {
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('finance-tracker');

  // Create a test user
  const user = {
    email: 'test@example.com',
    password: 'hashedpass',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    oauthProvider: 'local'
  };
  const result = await db.collection('users').insertOne(user);
  userId = result.insertedId;
  token = jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await db.collection('users').deleteMany();
  await db.collection('transactions').deleteMany();
  await client.close();
});

describe('GET /api/v1/transactions', () => {
  it('should return transactions for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/v1/transactions/:id', () => {
  it('should return a single transaction', async () => {
    const transaction = {
      userId,
      amount: 100,
      description: 'Test transaction',
      date: new Date(),
      type: 'income',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('transactions').insertOne(transaction);

    const res = await request(app)
      .get(`/api/v1/transactions/${result.insertedId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Test transaction');
  });
});

// ... existing code ...

// Categories tests
describe('GET /api/v1/categories', () => {
  it('should return categories for authenticated user', async () => {
    const res = await request(app).get('/api/v1/categories').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/v1/categories/:id', () => {
  it('should return a single category', async () => {
    const category = { userId, name: 'Food', description: 'Groceries', createdAt: new Date() };
    const result = await db.collection('categories').insertOne(category);
    const res = await request(app).get(`/api/v1/categories/${result.insertedId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Food');
  });
});

// Budgets tests
describe('GET /api/v1/budgets', () => {
  it('should return budgets for authenticated user', async () => {
    const res = await request(app).get('/api/v1/budgets').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/v1/budgets/:id', () => {
  it('should return a single budget', async () => {
    const budget = { userId, categoryId: new ObjectId(), amount: 500, month: 10, year: 2023, createdAt: new Date() };
    const result = await db.collection('budgets').insertOne(budget);
    const res = await request(app).get(`/api/v1/budgets/${result.insertedId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(500);
  });
});

// Add similar tests for Users and Transactions if needed (already have some)