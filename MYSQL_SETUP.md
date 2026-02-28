# MySQL Configuration & Setup Guide

## Environment Configuration

The application is configured to use MySQL database with the following credentials:

### Database Connection Details (in .env.local)

```env
DB_CONNECTION=mysql
DB_HOST=192.168.1.101
DB_PORT=3306
DB_DATABASE=liver_deases_prediction
DB_USERNAME=root
DB_PASSWORD=C0mplex
```

### Authentication & Stripe

```env
# JWT Secret (keep it safe!)
JWT_SECRET=change-this-to-a-secure-random-string-in-production-12345678

# Stripe Test Keys (from dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51T5hGu1qRa8KJKfA3xNyZAbkNnmbGBV7YsZqOvk1gs17tCDJOAlq4lNtltbKG3LMNpxV2Hr70X6mI94DbnCNHR7F00VKnlALWE
STRIPE_SECRET_KEY=sk_test_51T5hGu1qRa8KJKfAlHueNRfXCDfhGmC6zuHqnZI2EiW1r83sw5h9RmxMzx1MhtM1WqsZrBbLKkzgMS2aUvqjAxK800tCyc5zdo

# Optional ML API
ML_API_URL=http://localhost:5000/predict

# Node Environment
NODE_ENV=development
```

## Database Setup

### Prerequisites

1. **MySQL Server** running on 192.168.1.101:3306
2. **MySQL User**: root with password C0mplex
3. **Create Database**: liver_deases_prediction

### Create Database Manually

If the database doesn't exist, run this SQL command:

```sql
CREATE DATABASE liver_deases_prediction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Automatic Table Creation

Tables are created automatically on first application run:
- users
- doctors
- health_records
- predictions
- appointments
- payments

## Installation & Running

### 1. Install Dependencies

```bash
pnpm install
```

This installs:
- mysql2 - MySQL database driver
- redux & react-redux - State management
- stripe - Payment processing
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication

### 2. Start Development Server

```bash
pnpm dev
```

The app will:
1. Automatically connect to MySQL at 192.168.1.101
2. Create all required tables if they don't exist
3. Initialize Redux store with cache
4. Start on http://localhost:3000

### 3. Build for Production

```bash
pnpm build
pnpm start
```

## Key Features

### Authentication
- User registration with email/password
- JWT-based authentication (7-day expiration)
- Password hashing with bcryptjs (10 salt rounds)
- Three roles: patient, doctor, admin

### Health Assessment
- Medical form submission with 11 parameters
- AI-based risk calculation (Low/Medium/High)
- Personalized recommendations
- Health history tracking

### Doctor Management
- Doctor profile creation and search
- Specialty-based filtering
- Rating system
- Clinic information storage

### Appointments
- Book appointments with available doctors
- Appointment status tracking
- Doctor and patient views
- Appointment history

### Payments
- Stripe payment integration
- Payment intent creation
- Transaction history
- Consultation fees

### State Management (Redux)
- Auth state: user, token, role
- Predictions state: health assessments & results
- Appointments state: bookings & schedule
- Doctors state: profiles & search results
- Cache storage: persists state to localStorage

## API Endpoints

### Authentication
- `POST /api/auth?action=register` - Register new user
- `POST /api/auth?action=login` - Login user

### Health Predictions
- `POST /api/predictions` - Submit health assessment
- `GET /api/predictions` - Get prediction history

### Doctors
- `GET /api/doctors?specialty=General` - Search doctors
- `POST /api/doctors` - Create doctor profile

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments
- `PATCH /api/appointments` - Update appointment status

### Payments
- `POST /api/payments` - Create payment intent
- `PUT /api/payments` - Update payment status
- `GET /api/payments` - Get payment history

## Troubleshooting

### Database Connection Failed
1. Check MySQL server is running on 192.168.1.101:3306
2. Verify credentials: root / C0mplex
3. Ensure database "liver_deases_prediction" exists
4. Check firewall allows port 3306

### Stripe Payment Issues
1. Verify Stripe test keys in .env.local
2. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is exposed to client
3. Check Stripe webhook configuration for webhooks

### JWT Token Invalid
1. Verify JWT_SECRET is set in .env.local
2. Check token expiration (7 days)
3. Ensure x-user-id header is sent in requests

### Redux State Not Persisting
1. Clear browser localStorage if issues
2. Check browser console for errors
3. Verify cache-storage.ts is loaded

## Production Deployment

### Security Checklist
- [ ] Change JWT_SECRET to a long random string
- [ ] Use production Stripe keys (pk_live_, sk_live_)
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure database backups
- [ ] Enable database connection pooling
- [ ] Add rate limiting on API routes
- [ ] Set up monitoring and logging
- [ ] Configure CORS properly

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=secure-production-password
JWT_SECRET=your-secure-jwt-secret-min-32-chars
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

## Database Schema

### users
- id (UUID, Primary Key)
- email (Unique, Not Null)
- password (Hashed)
- fullName
- role (patient, doctor, admin)
- createdAt, updatedAt

### doctors
- id (UUID, Primary Key)
- userId (Foreign Key)
- specialty, qualifications
- experience, clinicName
- clinicAddress, phone
- rating, consultationFee

### health_records
- id (UUID, Primary Key)
- userId (Foreign Key)
- age, sex, alcohol
- bilirubin, alkalinePhosphatase
- sgpt, sgot, totalProtein
- albumin, ratioCorrectedCalcium

### predictions
- id (UUID, Primary Key)
- userId, healthRecordId (Foreign Keys)
- riskScore, riskLevel
- recommendation (text)

### appointments
- id (UUID, Primary Key)
- patientId, doctorId (Foreign Keys)
- appointmentDate
- status (scheduled, completed, cancelled)

### payments
- id (UUID, Primary Key)
- appointmentId, userId, doctorId (Foreign Keys)
- amount, status
- stripePaymentIntentId
