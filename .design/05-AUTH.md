# Authentication Design

## Overview

Simple token-based authentication using UUID v4 tokens. No JWT, no bcrypt - just direct token comparison for simplicity.

## Authentication Flow

### 1. Registration

```
Client                          Server
  │                                │
  │  POST /auth/register           │
  │  { email, name }              │
  │ ─────────────────────────────> │
  │                                │
  │                    Generate UUID v4
  │                    Store token in DB
  │                                │
  │  201 { user, token }           │
  │ <───────────────────────────── │
  │                                │
  │  Display token to user          │
  │  (shown only once)             │
```

### 2. Login

```
Client                          Server
  │                                │
  │  POST /auth/login              │
  │  { token }                    │
  │ ─────────────────────────────> │
  │                                │
  │                    Find user by token
  │                    Validate exists
  │                                │
  │  200 { user, token }           │
  │ <───────────────────────────── │
  │                                │
  │  Store token in localStorage   │
```

### 3. Authenticated Request

```
Client                          Server
  │                                │
  │  GET /api/tasks                │
  │  Authorization: Bearer <token> │
  │ ─────────────────────────────> │
  │                                │
  │                    Find user by token
  │                    Return data
  │                                │
  │  200 { tasks }                 │
  │ <───────────────────────────── │
```

### 4. Logout

```
Client                          Server
  │                                │
  │  POST /auth/logout             │
  │ ─────────────────────────────> │
  │                                │
  │                    Destroy session
  │                                │
  │  200 { message }               │
  │ <───────────────────────────── │
  │                                │
  │  Clear localStorage            │
  │  Redirect to /login            │
```

## Token Revocation / Reset (Logout All Devices)

A user can submit their current token on the **Revoke Token** page to revoke it and generate a new one. This logs out all active sessions and emails the new secret key to the user's registered email.

### Revoke Token Flow

```
Client                          Server
  │                                │
  │  POST /auth/revoke             │
  │  (Authorization: Bearer <token>)│
  │ ─────────────────────────────> │
  │                                │
  │                    Find user by token (from header)
  │                    If not found → 401 "Invalid token"
  │                                │
  │                    Generate NEW UUID v4 secret key
  │                    Directly replace old secretKey in DB
  │                    Send new secretKey to user's email
  │                    (email is read-only, from registration)
  │                    Old token is now invalid
  │                                │
  │  200 { message: "Token revoked. New key sent to email." }
  │ <───────────────────────────── │
  │                                │
  │  Clear localStorage             │
  │  Redirect to /login            │
  │  Show toast: "Check your email for new secret key"
```

---

## Token Management

### Token Generation
- Use `crypto.randomUUID()` (UUID v4)
- 36 characters: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- Example: `550e8400-e29b-41d4-a716-446655440000`

### Token Storage

**Database (User table):**
```sql
secretKey VARCHAR(255) @unique  -- The plain UUID token
```

**Frontend (localStorage):**
```javascript
localStorage.setItem('auth-storage', JSON.stringify({
  user: { id, email, name },
  token: '550e8400-e29b-41d4-a716-446655440000',
  isAuthenticated: true
}))
```

### Token Usage

1. **Login response**: Server returns token, client stores in localStorage
2. **API requests**: Client sends token in `Authorization: Bearer <token>` header
3. **Server validation**: Query `User` table where `secretKey = <token>`
   - On revoke: server replaces old `secretKey` with new UUID directly in DB
   - Old token won't find any user → 401 Unauthorized

## Auth Middleware

```typescript
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  const user = await prisma.user.findFirst({
    where: { secretKey: token },
    select: { id: true, email: true }
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
};
```

## Security Considerations

### Current Implementation
- ✅ Token is random UUID (not guessable)
- ✅ Token stored in database
- ✅ Each user has unique token
- ✅ Token sent via HTTPS header (production)
- ✅ Token revocation (logout all devices) via `/auth/revoke`
- ✅ Old token immediately invalid after revoke (directly replaced in DB)

### Missing (Optional Enhancements)
- ❌ Token expiration (infinite validity — handled by revoke replacing old token)
- ❌ Rate limiting on login attempts
- ❌ Account lockout after failed attempts

### Future Improvements (if needed)
1. Add `tokenExpiry` field to User
2. Refresh token endpoint
3. Rate limit auth endpoints
4. Add failed login tracking

## Session vs Token

For this implementation:
- **Token**: Primary authentication (UUID stored in DB)
- **Session**: Express session for SSR/middleware convenience

The token from login is stored in `req.session` after successful authentication, but the UUID token is the true credential.

## Client-Side Auth Store (Zustand)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
```

## API Response Interceptor

```typescript
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## User Experience Flow

1. **Registration**:
   - User enters email + name
   - Server generates UUID token
   - Token displayed ONCE with "Copy" button
   - Warning: "Save token - not shown again"

2. **Login**:
   - User pastes token into input
   - Token validated against database (must match `secretKey`)
   - Success: redirect to dashboard
   - Failure: show error toast

3. **Revoke Token (Logout All Devices)**:
   - Available on `/revoke` page (requires being logged in)
   - Server uses the authenticated user's identity directly (from `Authorization` header)
   - Server generates a new UUID secret key
   - Server directly updates the new secretKey in the DB
   - New secret key sent to the user's **registered email** (read-only, set at registration)
   - All existing sessions invalidated immediately
   - User is logged out locally, redirected to `/login`
   - Toast: "Check your email for your new secret key"

4. **Session Timeout / Token Revoked**:
   - 401 response triggers logout
   - Clear localStorage
   - Redirect to /login
