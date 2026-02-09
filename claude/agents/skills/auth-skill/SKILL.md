---
name: auth-skill
description: Implement secure authentication flows including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Auth Skill – Secure Authentication & Authorization

## Instructions

1. **Signup & Signin Flows**
   - Implement secure user registration and login
   - Validate email, username, and password inputs
   - Prevent duplicate accounts and enumeration attacks
   - Handle authentication errors safely

2. **Password Security**
   - Hash passwords using industry-standard algorithms (bcrypt, argon2)
   - Use proper salting and cost factors
   - Never store or log plaintext passwords
   - Implement secure password comparison

3. **JWT & Session Management**
   - Generate short-lived access tokens
   - Implement refresh tokens with rotation
   - Validate JWT signature, expiration, and claims
   - Revoke tokens on logout or credential changes

4. **Better Auth Integration**
   - Configure Better Auth providers correctly
   - Follow recommended authentication patterns
   - Secure OAuth callbacks and redirects
   - Manage sessions and tokens using Better Auth APIs

5. **Security Protections**
   - Implement rate limiting and brute-force protection
   - Use httpOnly, secure cookies for sensitive tokens
   - Protect against CSRF, XSS, and replay attacks
   - Store secrets using environment variables

## Validation Rules

- Validate and sanitize all user inputs (email, password, tokens)
- Enforce schema validation for auth requests and responses
- Reject malformed or missing authentication data early

## Best Practices
- Follow OWASP authentication guidelines for industry-standard security
- Use least-privilege principles for access control
- Prefer secure defaults over convenience in all design decisions
- Use clear and consistent error messages without leaking sensitive information
- Log authentication events without exposing credentials or sensitive data
- Design auth flows to be scalable and maintainable
- Clearly document authentication behavior, edge cases, and security assumptions

## Example Flow
```text
User Signup:
1. Validate input data
2. Hash password securely
3. Store user record
4. Issue JWT access + refresh tokens

User Signin:
1. Validate credentials
2. Compare password hashes
3. Issue new tokens
4. Establish secure session