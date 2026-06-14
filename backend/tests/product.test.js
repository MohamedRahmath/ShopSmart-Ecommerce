const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const Product = require('../models/Product')
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
  await Product.deleteMany()
  await User.deleteMany()
})

describe('Product Endpoints', () => {
  test('GET /api/products - should return 200 and an array of products', async () => {
    await Product.create({
      name: 'Sample Product',
      description: 'A sample product for testing',
      price: 1000,
      category: 'Electronics',
      stock: 10,
    })

    const res = await request(app).get('/api/products')

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  test('POST /api/products - should return 401 without a token', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Unauthorized Product',
        price: 500,
        category: 'Books',
        stock: 5,
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
  })

  test('POST /api/products - should return 403 with a non-admin token', async () => {
    // Register a normal (non-admin) user and log in
    await request(app).post('/api/auth/register').send({
      name: 'Regular User',
      email: 'regularuser@example.com',
      password: 'password123',
    })

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'regularuser@example.com',
      password: 'password123',
    })

    const token = loginRes.body.token

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Unauthorized Product',
        price: 500,
        category: 'Books',
        stock: 5,
      })

    expect(res.statusCode).toBe(403)
    expect(res.body.success).toBe(false)
  })
})