# ShopSmart-Ecommerce

ShopSmart is a full-stack e-commerce platform built using the MERN stack
(MongoDB, Express.js, React.js, Node.js). It is developed for the ITS3552
Software Engineering II module assignment.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB (Mongoose ODM)
- Frontend: React.js (Vite), Tailwind CSS, React Router, Axios
- Auth: JWT (`jsonwebtoken`), `bcryptjs` for password hashing
- Security: Helmet, `express-rate-limit`, `express-validator`, CORS
- Logging: Morgan, Winston
- Testing: Jest, Supertest, `mongodb-memory-server` (backend); Vitest, React Testing Library (frontend)
- Deployment: Render (backend), Vercel (frontend), MongoDB Atlas

## Architecture

- Follows MVC pattern on the backend (models, controllers, routes, middleware)
- Component-based architecture on the frontend with Context API for global state
- RESTful API with versioned routes (`/api/v1/...`)
- Consistent JSON response format: `{ success, data, message }`

## Coding Standards

- Use `async/await` with `try/catch` (or `asyncHandler` wrapper) for all controllers
- Validate all inputs using `express-validator` before processing
- Never expose passwords or sensitive fields in API responses
- All protected routes must use auth middleware; admin routes use auth + admin middleware
- Use environment variables for all secrets (never hardcode)
- Follow Conventional Commits format for git messages (`feat:`, `fix:`, `test:`, `docs:`, `chore:`)

## Database Collections

- Users: `name`, `email`, `password` (hashed), `role` (`customer/admin`), `addresses`
- Products: `name`, `description`, `price`, `category`, `images`, `stock`, `ratings`, `avgRating`
- Orders: `user`, `items`, `totalAmount`, `status`, `shippingAddress`, `paymentStatus`
- Reviews: `product`, `user`, `rating`, `comment`

## Naming Conventions

- `camelCase` for variables and functions
- `PascalCase` for React components and Mongoose models
- `kebab-case` for file names in routes/middleware
