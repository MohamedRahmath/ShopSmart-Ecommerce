const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const User = require('../models/User')

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await User.deleteMany()
})

describe('Auth Endpoints', () => {
  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  }

  test('POST /api/auth/register - should register a new user and return 201 with a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(userData.email)
    expect(res.body.user.password).toBeUndefined()
  })

  test('POST /api/auth/register - should return 400 when email already exists', async () => {
    await request(app).post('/api/auth/register').send(userData)

    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('POST /api/auth/login - should return 401 with wrong password', async () => {
    await request(app).post('/api/auth/register').send(userData)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' })

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
  })
})