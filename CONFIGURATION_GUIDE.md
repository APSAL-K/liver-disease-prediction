# Configuration Files Reference

## Essential Configuration Files

### 1. .env.local (Root Directory)
**Location**: `/vercel/share/v0-project/.env.local`

Contains all environment variables including:
- MySQL database credentials (host, port, username, password)
- JWT secret for authentication
- Stripe API keys (test and production)
- Node environment setting
- ML API endpoint (optional)

**DO NOT COMMIT** this file to version control!

---

### 2. Database Configuration
**File**: `/lib/db-mysql.ts`

Exports:
- `getDbConnection()` - Returns MySQL connection instance
- `initializeDatabase()` - Auto-creates tables on startup

Auto-creates tables:
- users
- doctors
- health_records
- predictions
- appointments
- payments

Runs automatically on server start.

---

### 3. Redux Store Configuration
**File**: `/lib/redux-store.ts`

Includes slices:
- `authSlice` - User authentication state
- `predictionsSlice` - Health assessments
- `appointmentsSlice` - Bookings
- `doctorsSlice` - Doctor profiles

Features:
- Redux Thunk for async operations
- localStorage persistence
- Cache management

---

### 4. Cache Storage Utility
**File**: `/lib/cache-storage.ts`

Methods:
- `setCache(key, value)` - Store in localStorage
- `getCache(key)` - Retrieve from localStorage
- `clearCache(key)` - Remove specific cache
- `clearAllCache()` - Clear everything

Cached items:
- User authentication tokens
- Prediction results
- Appointment bookings
- Doctor profiles

---

### 5. Authentication Utilities
**File**: `/lib/auth.ts`

Exports:
- `createToken()` - Generate JWT
- `verifyToken()` - Validate JWT
- `hashPassword()` - Hash passwords (bcryptjs)
- `comparePassword()` - Verify passwords
- `withAuth()` - Middleware for protected routes

JWT Configuration:
- Secret: from JWT_SECRET env var
- Expiration: 7 days
- Algorithm: HS256

---

### 6. API Error Handler
**File**: `/lib/api.ts`

Classes:
- `AppError` - Custom error class
- `handleError()` - Central error handler

Response format:
```json
{
  "error": "Error message",
  "status": 400,
  "details": []
}
```

---

### 7. Input Validators
**File**: `/lib/validators.ts`

Schemas:
- `registerSchema` - Validate registration
- `loginSchema` - Validate login
- `healthAssessmentSchema` - Validate medical form
- `appointmentSchema` - Validate booking
- `paymentSchema` - Validate payment

Uses Zod for validation.

---

## API Routes Configuration

### Authentication API
**File**: `/app/api/auth/route.ts`

- `POST /api/auth?action=register` - Registration
- `POST /api/auth?action=login` - Login

Uses MySQL via getDbConnection()

---

### Predictions API
**File**: `/app/api/predictions/route.ts`

- `POST /api/predictions` - Submit health assessment
- `GET /api/predictions` - Get predictions

Uses MySQL health_records & predictions tables

---

### Doctors API
**File**: `/app/api/doctors/route.ts`

- `GET /api/doctors` - List doctors with filtering
- `POST /api/doctors` - Create doctor profile

Uses MySQL doctors table with JOIN on users

---

### Appointments API
**File**: `/app/api/appointments/route.ts`

- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get appointments
- `PATCH /api/appointments` - Update appointment status

Differentiates between patient and doctor views

---

### Payments API
**File**: `/app/api/payments/route.ts`

- `POST /api/payments` - Create Stripe payment intent
- `PUT /api/payments` - Update payment status
- `GET /api/payments` - Get payment history

Integrates with Stripe API

---

## Redux Store Structure

```typescript
{
  auth: {
    user: { id, email, fullName, role },
    token: "jwt_token",
    loading: false,
    error: null
  },
  predictions: {
    predictions: [...],
    currentPrediction: {},
    loading: false,
    error: null
  },
  appointments: {
    appointments: [...],
    loading: false,
    error: null
  },
  doctors: {
    doctors: [...],
    loading: false,
    error: null
  }
}
```

---

## Environment Variables Complete List

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| DB_CONNECTION | Database type | Yes | mysql |
| DB_HOST | Database host | Yes | 192.168.1.101 |
| DB_PORT | Database port | Yes | 3306 |
| DB_DATABASE | Database name | Yes | liver_deases_prediction |
| DB_USERNAME | Database user | Yes | root |
| DB_PASSWORD | Database password | Yes | C0mplex |
| JWT_SECRET | JWT signing key | Yes | (secure random string) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe public key | Yes | pk_test_... |
| STRIPE_SECRET_KEY | Stripe secret key | Yes | sk_test_... |
| NODE_ENV | Environment | No | development |
| ML_API_URL | ML endpoint | No | http://localhost:5000 |
| AI_GATEWAY_API_KEY | Vercel AI Gateway | No | (if using) |

---

## File Structure Overview

```
/vercel/share/v0-project/
├── .env.local (Contains MySQL credentials & API keys)
├── lib/
│   ├── db-mysql.ts (MySQL connection & table setup)
│   ├── auth.ts (JWT & password utilities)
│   ├── api.ts (Error handling)
│   ├── validators.ts (Input validation schemas)
│   ├── redux-store.ts (Redux configuration)
│   └── cache-storage.ts (localStorage utility)
├── app/api/
│   ├── auth/route.ts
│   ├── predictions/route.ts
│   ├── doctors/route.ts
│   ├── appointments/route.ts
│   └── payments/route.ts
├── components/
│   ├── redux-provider.tsx (Redux Provider wrapper)
│   └── ... (UI components)
└── MYSQL_SETUP.md (This guide)
```

---

## Quick Verification Checklist

- [ ] .env.local exists with MySQL credentials
- [ ] MySQL server accessible at 192.168.1.101:3306
- [ ] Database "liver_deases_prediction" created
- [ ] Stripe test keys valid
- [ ] JWT_SECRET set (non-empty)
- [ ] Dependencies installed (`pnpm install`)
- [ ] No TypeScript errors (`pnpm build`)
- [ ] Redux provider in app/layout.tsx
- [ ] Database tables created on first run

---

## Common Configuration Tasks

### Change Database Host
Edit .env.local:
```env
DB_HOST=your-new-host
```

### Update Stripe Keys
Edit .env.local:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Change JWT Secret
Edit .env.local:
```env
JWT_SECRET=your-new-random-string-min-32-chars
```

### Add ML API Endpoint
Edit .env.local:
```env
ML_API_URL=http://your-ml-server:5000/predict
```

---

## Support & Documentation

- **MySQL Setup**: See MYSQL_SETUP.md
- **Setup Guide**: See SETUP_GUIDE.md  
- **API Docs**: See each API route file
- **Redux Store**: See lib/redux-store.ts
