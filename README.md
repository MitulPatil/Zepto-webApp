# 🛒 Zepto Clone - E-Commerce Web Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce application inspired by Zepto, featuring a modern UI with product browsing, cart management, user authentication, and order placement functionality.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-yellow)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🔐 User Authentication
- User registration with secure password hashing (bcrypt)
- Login with JWT token-based authentication
- Protected routes and API endpoints
- Auto-login with persisted tokens
- Modal-based login/signup (no separate pages)

### 🛍️ Product Management
- Browse products with images and details
- Category-based filtering (Fruits, Vegetables, Dairy, etc.)
- Price range filtering
- Search functionality
- Product cards with "Add to Cart" button

### 🛒 Shopping Cart
- Add/remove items from cart
- Update item quantities
- Real-time cart total calculation
- Cart persistence with localStorage
- Free delivery on orders above ₹99
- Guest checkout with login modal

### 📦 Order Management
- Complete checkout flow
- Saved address management (add, edit, delete, set default)
- Address selection or new address entry
- Save new addresses during checkout
- Order placement with delivery details
- Order success confirmation page
- Order history in user dashboard

### 👤 User Dashboard
- Profile management (edit name, phone)
- Address book with CRUD operations
- Order history with details
- Password change functionality
- Tab-based navigation

### 📱 Responsive Design
- Mobile-friendly navbar
- Adaptive layouts for all screen sizes
- Tailwind CSS for modern UI
- Purple theme (#581c87)

### 🎨 UI/UX Features
- Toast notifications for user feedback
- Loading states for async operations
- Form validation (10-digit phone numbers)
- Default address auto-selection
- Modal overlays with backdrop blur

---

## 🚀 Tech Stack

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing with modal overlays
- **Axios** - HTTP client for API requests
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Auto-restart server on changes
- **ESLint** - Code linting
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
Exotic-Intership/
├── backend/
│   ├── models/
│   │   ├── User.js           # User model with embedded addresses
│   │   ├── Product.js        # Product model
│   │   └── Order.js          # Order model
│   ├── routes/
│   │   ├── auth.js           # Authentication & user management routes
│   │   ├── products.js       # Product routes
│   │   └── orders.js         # Order routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Express server setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Navigation bar with modal triggers
│   │   │   ├── ProductCard.jsx   # Product display card
│   │   │   ├── LoginModal.jsx    # Login modal component
│   │   │   └── RegisterModal.jsx # Register modal component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User authentication state
│   │   │   └── CartContext.jsx   # Shopping cart state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Product listing with filters
│   │   │   ├── Cart.jsx          # Shopping cart page
│   │   │   ├── Checkout.jsx      # Checkout with address selection
│   │   │   ├── Profile.jsx       # User dashboard (702 lines)
│   │   │   └── OrderSuccess.jsx  # Order confirmation
│   │   ├── services/
│   │   │   ├── authApi.js        # Authentication API calls
│   │   │   ├── productApi.js     # Product API calls
│   │   │   └── orderApi.js       # Order API calls
│   │   ├── App.jsx               # Main app with routes
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔧 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in backend directory:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the backend server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API base URL (if needed):**
   - Open `frontend/src/services/authApi.js` (or other API files)
   - Ensure `baseURL` points to your backend: `http://localhost:5000/api`

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/zepto-clone` or Atlas URI |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key_here_min_32_chars` |

### Frontend
No environment variables required. API URL is configured in service files.

---

## 📡 API Endpoints

### Authentication & User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/update-profile` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/add-address` | Add new address | Yes |
| PUT | `/api/auth/update-address/:id` | Update address | Yes |
| DELETE | `/api/auth/delete-address/:id` | Delete address | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |

---

## 💻 Usage

### Running the Full Application

1. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend Application:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

### User Flow

1. **Browse Products:** Visit home page to see product listings
2. **Filter & Search:** Use category filters, price range, and search bar
3. **Add to Cart:** Click "Add to Cart" on product cards
4. **View Cart:** Click cart icon in header to see cart items
5. **Checkout:** Click "Proceed to Checkout"
   - If not logged in: Login modal appears
   - If logged in: Select saved address or add new one
6. **Place Order:** Click "Pay ₹X" button to complete order
7. **Manage Profile:** Click profile icon → manage addresses, view orders, change password

---

## 📸 Screenshots

### Key Features Implemented

#### 🏠 Home Page
- Product grid with category filters
- Price range slider
- Search functionality
- Responsive cards with "Add to Cart" buttons

#### 🛒 Shopping Cart
- Item list with quantity controls
- Remove items functionality
- Order summary with delivery fee calculation
- "Proceed to Checkout" button
- Login modal for guest users

#### 📦 Checkout Page
- **Saved Addresses:** Radio button selection with "DEFAULT" badge
- **New Address:** Form with "Save for future" checkbox
- **Payment Section:** Mock payment method (COD/UPI)
- **Order Summary:** Cart items, subtotal, delivery fee, total
- **Place Order Button:** Connected "Pay ₹X" button

#### 👤 User Dashboard
- **Profile Tab:** Edit name and phone number
- **Addresses Tab:** Add/edit/delete addresses, set default
- **Orders Tab:** View order history with details
- **Password Tab:** Change password with validation

#### 🔐 Authentication
- Modal-based login/signup (no page redirects)
- Form validation (10-digit phone numbers)
- Error handling with toast messages
- Auto-close on success

---

## 🎯 Future Enhancements

### Planned Features
- [ ] **Payment Gateway Integration:** Real Razorpay/Stripe integration
- [ ] **Admin Panel:** Product management, order management, user management
- [ ] **Product Reviews & Ratings:** User reviews and star ratings
- [ ] **Wishlist:** Save products for later
- [ ] **Order Tracking:** Real-time order status updates
- [ ] **Email Notifications:** Order confirmation, shipping updates
- [ ] **Product Stock Management:** Inventory tracking, out-of-stock indicators
- [ ] **Advanced Filters:** Brand, rating, availability filters
- [ ] **Coupon/Promo Codes:** Discount code application
- [ ] **Multi-language Support:** i18n implementation
- [ ] **Social Authentication:** Google/Facebook login
- [ ] **Product Recommendations:** AI-based suggestions
- [ ] **Live Chat Support:** Customer service integration

### Technical Improvements
- [ ] Unit & Integration Testing (Jest, React Testing Library)
- [ ] CI/CD Pipeline Setup
- [ ] Performance Optimization (lazy loading, code splitting)
- [ ] SEO Optimization
- [ ] PWA Features (offline support, push notifications)
- [ ] Docker Containerization
- [ ] Redis Caching for better performance
- [ ] GraphQL API alternative

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created for learning purposes as part of an internship project.

---

## 👨‍💻 Author

**Internship Project - Exotic Internship**  
*Full-Stack MERN Developer*

---

## 🙏 Acknowledgments

- Inspired by **Zepto** e-commerce platform
- Built with modern web technologies and best practices
- React and Node.js communities for excellent documentation
- Tailwind CSS for beautiful UI components

---

## 📞 Support

For issues, questions, or contributions, please:
- Open an issue in the repository
- Contact the development team

---

**Happy Shopping! 🛒✨**
