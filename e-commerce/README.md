# E-Commerce Application

## Overview
This is an e-commerce platform developed as part of the CTI Advanced Programming course. The application provides a complete online shopping experience with product browsing, cart management, order processing, and payment integration.

## Features

### Customer Features
- **Product Catalog**: Browse products by category with search and filtering capabilities
- **Product Details**: View detailed product information, images, specifications, and reviews
- **Shopping Cart**: Add/remove items, update quantities, and view cart summary
- **User Authentication**: Register, login, and manage user profiles
- **Checkout Process**: Multi-step checkout with shipping and billing information
- **Payment Integration**: Secure payment processing with multiple payment methods
- **Order History**: View past orders and track current order status
- **Wishlist**: Save favorite products for later purchase
- **Product Reviews**: Rate and review purchased products

### Admin Features
- **Product Management**: Create, update, and delete products
- **Inventory Management**: Track stock levels and manage product variants
- **Order Management**: View, process, and update order statuses
- **Customer Management**: View and manage customer accounts
- **Analytics Dashboard**: Sales reports, revenue tracking, and performance metrics
- **Category Management**: Organize products into categories and subcategories

## Technology Stack

### Frontend
- **Framework**: React.js / Next.js
- **State Management**: Redux / Context API
- **Styling**: CSS Modules / Tailwind CSS / Material-UI
- **Form Validation**: Formik / React Hook Form
- **HTTP Client**: Axios / Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js / NestJS
- **Database**: MongoDB / PostgreSQL / MySQL
- **ORM**: Mongoose / Prisma / TypeORM
- **Authentication**: JWT / OAuth 2.0
- **Payment Gateway**: Stripe / PayPal API

### Additional Tools
- **Image Storage**: Cloudinary / AWS S3
- **Email Service**: SendGrid / Nodemailer
- **API Documentation**: Swagger / OpenAPI
- **Testing**: Jest, React Testing Library, Supertest

## Project Structure

```
e-commerce/
├── frontend/              # React/Next.js frontend application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components/routes
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── utils/        # Helper functions
│   │   └── styles/       # Global styles
│   └── package.json
│
├── backend/              # Node.js backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── services/     # Business logic
│   │   └── config/       # Configuration files
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB/PostgreSQL (depending on configuration)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cti-adp-software/e-commerce
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   EMAIL_SERVICE_API_KEY=your_email_service_key
   ```
   
   Create `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

5. **Database Setup**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed    # Optional: Seed with sample data
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

## Testing

### Run Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Run Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend Deployment (Heroku/AWS/DigitalOcean)
```bash
cd backend
npm run build
npm start
```

## Key Learning Objectives

This project demonstrates proficiency in:
- Full-stack web development with modern JavaScript frameworks
- RESTful API design and implementation
- Database modeling and management
- User authentication and authorization
- Payment gateway integration
- State management in complex applications
- Responsive UI/UX design
- Security best practices (input validation, XSS prevention, CSRF protection)
- Error handling and logging
- Testing and quality assurance
- Deployment and DevOps

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of the CTI Advanced Programming course.

## Contact

For questions or support, please contact the course instructor or team members.

---

**Project Status**: In Development
**Course**: CTI - Advanced Programming
**Academic Year**: 2025-2026
