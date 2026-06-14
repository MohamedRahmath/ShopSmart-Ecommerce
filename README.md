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

## Quick Start

### 1. Configure Environment Variables

Create `backend/.env` from `backend/.env.example` and fill your real values.

Required:

- `MONGO_URI`
- `JWT_SECRET`

### 2. Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 3. Run the App

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### 4. Smoke Check

- API health: `GET http://localhost:5000/api/v1/health`
- Frontend: `http://localhost:5173`

## Project Completion Roadmap

Use this checklist to finish the full assignment.

### Backend Core

- Create models: `User`, `Product`, `Order`, `Review`
- Add auth controller/routes: register, login, profile
- Add product controller/routes: list, get by id, create/update/delete (admin)
- Add order controller/routes: place order, my orders, all orders (admin)
- Add review controller/routes: add/update review

### Middleware and Validation

- Add `auth` middleware (JWT verify)
- Add `admin` middleware (role check)
- Add centralized `errorHandler` + `notFound` middleware
- Add `express-validator` schemas for all write endpoints

### Security and Reliability

- Ensure password hashing with bcrypt salt rounds (12)
- Ensure password is never returned (`select: false`)
- Add request logging (morgan) and app logging (winston)
- Add rate limits to auth endpoints and global API

### Frontend Features

- Set up routes: home, product details, cart, checkout, login/register, admin
- Create `AuthContext` and `CartContext` with localStorage persistence
- Build product listing, product detail, cart, and checkout pages
- Build admin pages for product and order management

### Testing

- Backend unit tests for controllers/services (Jest)
- Backend integration tests for key APIs (Supertest + mongodb-memory-server)
- Frontend component tests for critical flows (RTL + Vitest)
- Target at least 70% backend business-logic coverage

### Deployment

- Deploy backend (Render)
- Deploy frontend (Vercel)
- Configure production env variables and CORS origins
- Verify full flow in production (register -> cart -> order -> admin update)
