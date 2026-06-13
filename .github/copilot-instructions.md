# ShopSmart - Project Context for GitHub Copilot

## Project Overview
ShopSmart is a full-stack AI-powered e-commerce platform built using the MERN stack 
(MongoDB, Express.js, React.js, Node.js). It is developed as a group project for the 
ITS3552 Software Engineering II module at the University of Sri Jayewardenepura.

The platform allows customers to browse products, add items to cart, place orders, 
and leave reviews. Admins can manage products, orders, and view basic analytics.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB with Mongoose ODM
- Frontend: React.js (Vite), Tailwind CSS, React Router v6, Axios
- Authentication: JWT (jsonwebtoken), bcryptjs for password hashing
- Security: Helmet, express-rate-limit, express-validator, CORS
- Logging: Morgan (HTTP request logging), Winston (application logging)
- Testing: Jest + Supertest + mongodb-memory-server (backend), Vitest + React Testing Library (frontend)
- Deployment: Render (backend), Vercel (frontend), MongoDB Atlas (database)

## Architecture
- Backend follows the MVC pattern: models/, controllers/, routes/, middleware/, utils/
- Frontend follows a component-based architecture with React Context API for global state
  (AuthContext for authentication, CartContext for shopping cart)
- API is RESTful and versioned under /api/v1/
- All API responses follow this consistent JSON shape:
  { success: boolean, data: object|array, message: string }

## Coding Standards
- Use async/await with try/catch in all controllers; wrap with an asyncHandler utility
  to forward errors to the centralized error middleware
- Validate all request bodies using express-validator before processing
- Never return password fields in API responses (use select: false in schema)
- Protected routes must use the auth middleware (verifies JWT)
- Admin-only routes must use auth middleware + admin middleware (checks role === 'admin')
- Store all secrets (JWT_SECRET, MONGO_URI, API keys) in .env - never hardcode
- Hash passwords with bcrypt using 12 salt rounds
- Use Conventional Commits for git messages: feat:, fix:, test:, docs:, chore:, refactor:

## Database Collections (MongoDB)
- **Users**: name, email (unique), password (hashed, select:false), role (enum: customer/admin), 
  addresses (array), isActive, timestamps
- **Products**: name, description, price, category, images (array of URLs), stock, 
  ratings (array of Review refs), avgRating, tags, isActive
- **Orders**: user (ref User), items (array of {product, quantity, priceAtPurchase}), 
  totalAmount, status (enum: Pending/Processing/Shipped/Delivered/Cancelled), 
  shippingAddress, paymentStatus (enum: Pending/Paid/Failed/Refunded), timestamps
- **Reviews**: product (ref Product), user (ref User), rating (1-5), comment, timestamps

## Key API Endpoints
- POST /api/v1/auth/register - register new user
- POST /api/v1/auth/login - login, returns JWT
- GET /api/v1/products - list products (pagination, filter, search)
- GET /api/v1/products/:id - get single product
- POST /api/v1/products - create product (admin only)
- PUT /api/v1/products/:id - update product (admin only)
- DELETE /api/v1/products/:id - soft delete product (admin only)
- POST /api/v1/orders - place order (authenticated users)
- GET /api/v1/orders/my - get logged-in user's orders
- GET /api/v1/orders - get all orders (admin only)
- PUT /api/v1/orders/:id/status - update order status (admin only)
- POST /api/v1/products/:id/reviews - add review (authenticated users)

## Naming Conventions
- camelCase for variables, functions, and JS files (e.g., authController.js)
- PascalCase for React components and Mongoose models (e.g., ProductCard.jsx, User.js)
- kebab-case for non-component file names where applicable
- Route files named as: resource.routes.js (e.g., auth.routes.js)
- Controller files named as: resource.controller.js (e.g., auth.controller.js)

## Frontend Notes
- All UI must be responsive (mobile, tablet, desktop) using Tailwind CSS utility classes
- Use React Router v6 for navigation
- Auth state and cart state are managed via Context API and persisted to localStorage
- Protected routes redirect unauthenticated users to /login
- Admin routes are only accessible to users with role === 'admin'

## Testing Notes
- Backend unit tests mock dependencies (e.g., mock service layer in controller tests)
- Backend integration tests use mongodb-memory-server for isolated test database
- Frontend component tests use React Testing Library with mock API calls
- Target minimum 70% code coverage on backend business logic