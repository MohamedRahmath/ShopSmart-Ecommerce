require('dotenv').config()

// Provide fallback values for test environment if .env doesn't have them
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_for_testing_only'
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'