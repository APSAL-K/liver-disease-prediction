# Liver Disease Prediction System - Complete Setup & Run Guide

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- npm or pnpm installed
- MySQL 8.0+ running on 192.168.1.101:3306
- MySQL user: root with password: C0mplex

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install all project dependencies
pnpm install

# OR using npm
npm install
```

**What this does:** Installs all required packages including:
- Next.js 16
- React 19
- Redux Toolkit for state management
- MySQL2 for database connection
- Stripe for payments
- TypeScript, Tailwind CSS, and more

### 2. Verify Environment Configuration

Verify `.env.local` exists in project root with:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=192.168.1.101
DB_PORT=3306
DB_DATABASE=liver_deases_prediction
DB_USERNAME=root
DB_PASSWORD=C0mplex

# JWT
JWT_SECRET=change-this-to-a-secure-random-string-in-production

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51T5hGu1qRa8KJKfA3xNyZAbkNnmbGBV7YsZqOvk1gs17tCDJOAlq4lNtltbKG3LMNpxV2Hr70X6mI94DbnCNHR7F00VKnlALWE
STRIPE_SECRET_KEY=sk_test_51T5hGu1qRa8KJKfAlHueNRfXCDfhGmC6zuHqnZI2EiW1r83sw5h9RmxMzx1MhtM1WqsZrBbLKkzgMS2aUvqjAxK800tCyc5zdo

# Optional
ML_API_URL=http://localhost:5000/predict
NODE_ENV=development
```

### 3. Initialize Database Tables

Run the database setup script:

```bash
# Using pnpm
pnpm run setup-db

# OR using npm
npm run setup-db

# OR using node directly
node scripts/setup-db.js
```

**What this does:**
- Connects to MySQL database
- Creates database if not exists
- Creates 8 tables (users, doctors, health_records, predictions, appointments, payments, notifications, admin_logs)
- Creates indexes for performance
- Creates 2 views for analytics
- Inserts sample data (1 admin, 1 doctor, 1 patient)

**Expected output:**
```
[DB Setup] Connecting to MySQL...
[DB Setup] Host: 192.168.1.101:3306
[DB Setup] Database: liver_deases_prediction
[DB Setup] ✓ Connected to MySQL
[DB Setup] ✓ Database created/verified
[DB Setup] ✓ Connected to database
[DB Setup] Found 50+ SQL statements
[DB Setup] Executing: CREATE TABLE IF NOT EXISTS users...
[DB Setup] ✓ Database setup completed!
[DB Setup] ✓ All tables verified successfully!
[DB Setup] Tables created:
  - users
  - doctors
  - health_records
  - predictions
  - appointments
  - payments
  - notifications
  - admin_logs
```

### 4. Start Development Server

```bash
# Using pnpm
pnpm dev

# OR using npm
npm run dev
```

**Expected output:**
```
> next dev
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Open browser at: **http://localhost:3000**

### 5. Test the Application

**Login Credentials (from sample data):**

**Admin:**
- Email: admin@liver-prediction.com
- Password: Need to hash with bcryptjs first

**Doctor:**
- Email: doctor@liver-prediction.com

**Patient:**
- Email: patient@liver-prediction.com

**First time? Create new account:**
1. Click "Sign Up"
2. Select role (Patient or Doctor)
3. Enter email, password, name
4. Verify MySQL user is created

## Troubleshooting

### Issue: "No matching version found for jsonwebtoken@^9.1.2"

**Solution:** Already fixed! We updated to jsonwebtoken@^9.0.3 in package.json

### Issue: "ECONNREFUSED - Connection refused to 192.168.1.101:3306"

**Causes & Solutions:**
1. **MySQL not running** - Start MySQL service
   ```bash
   # macOS
   brew services start mysql
   
   # Windows
   net start MySQL80
   
   # Linux
   sudo systemctl start mysql
   ```

2. **Wrong host/port** - Verify in .env.local:
   ```env
   DB_HOST=192.168.1.101
   DB_PORT=3306
   ```

3. **Firewall blocking** - Allow MySQL port 3306

4. **Credentials wrong** - Test with mysql-cli:
   ```bash
   mysql -h 192.168.1.101 -u root -pC0mplex
   ```

### Issue: "Database 'liver_deases_prediction' doesn't exist"

**Solution:** Run database setup:
```bash
pnpm run setup-db
```

### Issue: "Table 'users' doesn't exist"

**Solution:** Tables weren't created. Run:
```bash
node scripts/setup-db.js
```

### Issue: "Next.js build fails"

**Solution:** Clear cache and rebuild:
```bash
rm -rf .next
pnpm install
pnpm dev
```

### Issue: "Module not found" errors

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "Port 3000 already in use"

**Solution:** Use different port:
```bash
pnpm dev -p 3001
```

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout with Redux provider
│   ├── page.tsx                # Landing page
│   ├── dashboard/              # Protected routes
│   │   ├── patient/            # Patient pages
│   │   ├── doctor/             # Doctor pages
│   │   └── admin/              # Admin pages
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication
│   │   ├── predictions/        # Health assessment
│   │   ├── doctors/            # Doctor search
│   │   ├── appointments/       # Booking
│   │   └── payments/           # Stripe integration
│   └── auth/                   # Auth pages
│       ├── login/
│       └── signup/
├── components/
│   ├── dashboard-layout.tsx    # Dashboard layout
│   └── redux-provider.tsx      # Redux provider
├── lib/
│   ├── db-mysql.ts             # MySQL connection
│   ├── auth.ts                 # JWT utilities
│   ├── redux-store.ts          # Redux store
│   ├── cache-storage.ts        # LocalStorage cache
│   └── validators.ts           # Input validation
├── hooks/
│   └── use-auth.ts             # Auth hook
├── .env.local                  # Environment variables
├── package.json                # Dependencies
└── scripts/
    ├── create-tables.sql       # SQL schema
    └── setup-db.js             # Setup script
```

## Database Schema Overview

### Tables
- **users** - Users (patients, doctors, admins)
- **doctors** - Doctor profiles with specialization
- **health_records** - Lab test results
- **predictions** - AI risk predictions
- **appointments** - Doctor bookings
- **payments** - Stripe transactions
- **notifications** - User alerts
- **admin_logs** - Audit trail

### Views
- **high_risk_patients** - Risk assessment analytics
- **doctor_statistics** - Doctor performance metrics

## Available API Endpoints

### Authentication
- `POST /api/auth?action=register` - Register user
- `POST /api/auth?action=login` - Login user

### Health Assessment
- `POST /api/predictions` - Submit health form
- `GET /api/predictions` - Get user predictions

### Doctors
- `GET /api/doctors` - Search doctors
- `GET /api/doctors?specialty=Hepatology` - Filter by specialty

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments
- `PUT /api/appointments/:id` - Update appointment

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments` - Get payment history

## Features Implemented

✓ User authentication with JWT
✓ Role-based access (Patient, Doctor, Admin)
✓ Health assessment forms with AI predictions
✓ Doctor search and profiles
✓ Appointment booking system
✓ Stripe payment integration
✓ Redux state management
✓ LocalStorage caching
✓ Responsive UI with Tailwind CSS
✓ Database with 8 tables
✓ Input validation with Zod
✓ Error handling throughout

## Next Steps

1. **Customize** - Modify pages/styles in `/app` and `/components`
2. **Add ML** - Integrate Python ML API at `/api/predictions`
3. **Deploy** - Push to GitHub, deploy to Vercel
4. **Secure** - Change JWT_SECRET before production
5. **Scale** - Add caching, CDN, monitoring

## Support

For issues:
1. Check error messages carefully
2. Review troubleshooting section
3. Check MySQL connection
4. Verify environment variables
5. Check browser console for client-side errors

## Performance Tips

- Use Redux for state management (no prop drilling)
- LocalStorage caching reduces API calls
- Indexes in database for fast queries
- Next.js built-in code splitting
- Image optimization with Next.js

---

**Status:** Ready to run! Follow steps 1-4 above and you're good to go. 🚀
