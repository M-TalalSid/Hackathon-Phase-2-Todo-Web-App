---
name: backend-skill
description: Generate secure backend routes with JWT authentication, request/response handling, and database transactions. Use for building robust server-side APIs.
---

# Backend Skill

## Instructions

1. **Route Creation**
   - Define RESTful or GraphQL endpoints
   - Support GET, POST, PUT, DELETE methods
   - Follow consistent route naming conventions
   - Use route-level middleware for auth, validation, and logging

2. **Request Handling**
   - Parse request parameters, query strings, and body
   - Validate and sanitize all user input
   - Handle authentication and authorization using JWT or OAuth
   - Apply middleware for logging, rate limiting, and CORS

3. **Response Handling**
   - Return standardized JSON responses
   - Use appropriate HTTP status codes
   - Provide meaningful error messages without exposing sensitive data
   - Log errors for monitoring and debugging

4. **Database Integration**
   - Connect to SQL or NoSQL databases (PostgreSQL, MySQL, MongoDB, etc.)
   - Perform secure CRUD operations
   - Use ORM/ODM tools when appropriate
   - Wrap critical writes in transactions with proper commit/rollback
   - Handle database errors gracefully

5. **Business Logic**
   - Separate logic from routes (controllers/services)
   - Keep code clean, modular, and reusable
   - Handle async operations properly

## Best Practices
- Follow MVC or service-based architecture
- Keep route logic modular and reusable
- Always validate and sanitize input
- Use environment variables for secrets and DB credentials
- Handle errors consistently with try/catch or middleware
- Log requests and errors for monitoring
- Keep APIs consistent and predictable
- Follow security best practices:
  - Prevent SQL injection, XSS, CSRF
  - Hash passwords with bcrypt/argon2
  - Validate JWT tokens and permissions
  - Rate-limit sensitive endpoints

## Example Structure

```javascript
// Express.js example with JWT and transactions
const express = require('express');
const router = express.Router();
const db = require('../db'); // Supports transactions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateInput } = require('../utils/validation');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');

// POST /signup
router.post('/signup', validateInput, async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const trx = await db.transaction();
  try {
    const newUser = await db.createUser({ username, password: hashedPassword }, trx);
    await trx.commit();

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ success: true, token, data: newUser });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// POST /login
router.post('/login', validateInput, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET /users (protected route)
router.get('/users', authenticateJWT, authorizeRole('admin'), async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
