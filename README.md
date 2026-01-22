# 📝 Listify

A clean, full-stack todo application built with Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

## ✨ Features

- **User Authentication** - Secure signup/signin with JWT tokens and bcrypt password hashing
- **CRUD Operations** - Create, read, update, and delete todos
- **Input Validation** - Request validation using Zod schemas
- **Rate Limiting** - Protection against brute force and API abuse
- **Error Handling** - Centralized error handling middleware

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Security | express-rate-limit |

## 📁 Project Structure

```
├── assets/
│   ├── js/          # Frontend JavaScript
│   └── styles/      # CSS stylesheets
├── backend/
│   └── server.js    # Express server & routes
├── database/
│   └── db.js        # MongoDB models (User, Todo)
├── Middleware/
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Global error handler
│   ├── rateLimiter.js   # Rate limiting config
│   └── validation.js    # Zod validation middleware
├── public/
│   ├── auth.html    # Login/Signup page
│   └── index.html   # Main todo app
└── validators/
    ├── auth.validator.js  # Auth schemas
    └── todo.validator.js  # Todo schemas
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shashwatniranjan-max/Listify.git
   cd Listify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

4. **Start the server**
   ```bash
   node backend/server.js
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/signin` | Login and get JWT token |

### Todos (Protected - requires `token` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos for user |
| POST | `/todo` | Create a new todo |
| PUT | `/me/:id` | Update a todo (title/done) |
| DELETE | `/delete/:id` | Delete a todo |

## 🔒 Rate Limits

| Route | Limit | Window |
|-------|-------|--------|
| General API | 300 requests | 15 minutes |
| Auth routes | 15 attempts | 15 minutes |
| Todo creation | 60 requests | 15 minutes |

## 📄 License

MIT

---

Made with ❤️ by Shashwat
