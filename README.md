# ⌨️ KeyCrafter

KeyCrafter is a full-stack e-commerce application built with the **MERN Stack** (MongoDB, Express, React, Node.js) and **Tailwind CSS**. The system provides a complete shopping solution, making it easy for customers to search and purchase products (keyboards/keycaps), while offering a comprehensive dashboard for administrators to manage the store effectively.

## ✨ Features

### 🛒 For Customers
* **Authentication & Security:** Login, Register, Forgot Password, and Secure Password Reset using JWT and Bcrypt.
* **Shopping Experience:** Browse, search, filter, review products, and view detailed product information.
* **Interaction:** Add products to Cart and Wishlist.
* **Checkout & Payment:** Secure and reliable checkout process integrated directly with the **Stripe** API.
* **Personalization:** Manage personal profile information and track order history and details.

### 🛡️ For Administrators
* **Dashboard:** View overview statistics on the business performance of the application.
* **Store Management:** Create, Read, Update, and Delete (CRUD) Products, Brands, and Categories.
* **Media Upload:** Seamless image upload and storage capabilities powered by **Cloudinary**.
* **Order & User Management:** Update order statuses, manage user lists, and handle product reviews.

## 🚀 Tech Stack

### 💻 Frontend (Client)
* **Core:** React 18, Vite
* **State Management:** Redux Toolkit, React-Redux
* **Routing:** React Router DOM (v7)
* **Styling:** Tailwind CSS (v4), PostCSS
* **Networking:** Axios

### ⚙️ Backend (Server)
* **Core:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JSON Web Token (JWT)
* **Security:** Helmet, CORS, Express-rate-limit, Bcryptjs
* **Others:** Stripe (Payment), Cloudinary & Multer (File Upload), Nodemailer (Email Sending)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd KeyCrafter
   ```

2. **Install Backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure Backend environment variables:**
   Create a `.env` file in the `server/` directory and set the following variables (refer to the `.env.example` file):
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/keycrafter

   # JWT
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d

   # Cloudinary (Image Management)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Stripe (Online Payment)
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Email (Nodemailer config)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # Frontend URL
   CLIENT_URL=http://localhost:5173
   ```

4. **Install Frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

## 🏃 Run the Application

Open two new terminal windows to start the application.

Start the **Backend server** (usually runs on port 3000 or the configured PORT):
```bash
cd server
npm run dev
```

Start the **Frontend server** (runs using Vite on port 5173):
```bash
cd client
npm run dev
```

Open your web browser and visit: `http://localhost:5173`
