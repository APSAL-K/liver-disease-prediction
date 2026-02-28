SETUP & CONFIGURATION GUIDE - Liver Disease Prediction System

This guide explains all the configurations and setup needed to run the application.

=== DATABASE CONFIGURATION ===

SQLite Database Setup:
- The app uses SQLite (better-sqlite3) for data persistence
- Database file location: /data/liver_disease.db
- Automatically creates tables on first run
- No external database server required

Tables created:
1. users - Stores user accounts (patients, doctors, admins)
2. doctors - Doctor profiles and qualifications
3. health_records - Patient health assessment data
4. predictions - AI risk predictions
5. appointments - Appointment bookings
6. payments - Payment transactions

=== ENVIRONMENT CONFIGURATION ===

File: .env.local (already created)

Key Variables:

1. DATABASE_URL
   - Current: ./data/liver_disease.db
   - Path to SQLite database file

2. JWT_SECRET
   - Current: your-super-secret-jwt-key-change-this-in-production-12345
   - IMPORTANT: Change this in production!
   - Used for signing authentication tokens
   - Keep it secure and never commit to version control

3. Stripe Configuration
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_51QgLj2...
   - STRIPE_SECRET_KEY: sk_test_51QgLj2...
   - These are test keys - replace with real keys for production
   - Get your keys from https://dashboard.stripe.com

4. ML_API_URL
   - Current: http://localhost:5000/predict
   - For ML model integration (optional)

=== REDUX STATE MANAGEMENT ===

Redux Store Configuration:
- Location: /lib/redux-store.ts
- Manages global state for: auth, predictions, appointments, doctors

Store Slices:
1. auth - User authentication state
   - user, token, isAuthenticated, loading, error

2. predictions - Health predictions
   - predictions[], currentPrediction, loading, error

3. appointments - Doctor appointments
   - appointments[], currentAppointment, loading, error

4. doctors - Doctor directory
   - doctors[], currentDoctor, loading, error

Usage in Components:
```tsx
import { useAppSelector, useAppDispatch } from '@/hooks/use-redux'
import { authActions } from '@/lib/redux-store'

export function MyComponent() {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  
  const handleLogout = () => {
    dispatch(authActions.logout())
  }
}
```

=== CACHE STORAGE ===

Client-side Caching:
- Location: /lib/cache-storage.ts
- Uses browser localStorage for offline access
- Automatically persists: user data, tokens, predictions, appointments

Cache Methods:
- CacheStorage.setUser(user) / getUser()
- CacheStorage.setToken(token) / getToken()
- CacheStorage.set(key, value) / get(key)
- CacheStorage.clear() - Clear all cache

Benefits:
- Faster page loads
- Offline functionality
- Reduced API calls

=== API ROUTES ===

All API routes use SQLite with better-sqlite3:

1. POST /api/auth?action=register
   - Body: { email, password, firstName, lastName, role }
   - Returns: { token, user }

2. POST /api/auth?action=login
   - Body: { email, password }
   - Returns: { token, user }

3. POST /api/predictions
   - Body: Health assessment form data
   - Returns: { prediction with risk level }

4. GET /api/predictions
   - Query: x-user-id header
   - Returns: List of user predictions

5. GET /api/doctors
   - Query: ?specialty=cardiology
   - Returns: List of doctors

6. POST /api/doctors
   - Body: Doctor profile data
   - Returns: Doctor ID

7. POST /api/appointments
   - Body: { patientId, doctorId, appointmentDate, notes }
   - Returns: Appointment ID

8. GET /api/appointments
   - Query: ?patientId=xxx or ?doctorId=xxx
   - Returns: List of appointments

9. POST /api/payments
   - Body: { appointmentId, amount, userId }
   - Returns: { clientSecret, paymentId }

=== AUTHENTICATION ===

JWT Authentication:
- Tokens expire in 7 days
- Include token in headers: Authorization: Bearer <token>
- Pass userId in headers: x-user-id: <userId>

Password Security:
- Uses bcryptjs for hashing
- Salt rounds: 10
- Never store plain text passwords

User Roles:
- patient: Can view health records, book appointments
- doctor: Can manage appointments, see patients
- admin: Full system access

=== STRIPE INTEGRATION ===

Test Payment Setup:
- Uses Stripe test keys (payment won't actually process)
- Test card: 4242 4242 4242 4242
- Any future date and any CVC

Production Setup:
- Replace test keys with production keys
- Update STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Enable webhook handling for payment confirmations

=== DEPENDENCIES ===

Key Packages:
- next: ^16.1.6 - React framework
- react: ^19.2.4 - UI library
- @reduxjs/toolkit: ^1.9.7 - State management
- react-redux: ^8.1.3 - Redux integration
- better-sqlite3: ^9.2.2 - SQL database
- bcryptjs: ^2.4.3 - Password hashing
- jsonwebtoken: ^9.1.2 - JWT tokens
- stripe: ^15.3.0 - Payment processing
- zod: ^3.24.1 - Data validation

Install: pnpm install

=== RUNNING THE APP ===

Development:
pnpm dev
- Runs on http://localhost:3000
- Hot reload enabled

Production Build:
pnpm build
pnpm start

=== TROUBLESHOOTING ===

JWT_SECRET not available:
- Check .env.local file exists
- Ensure JWT_SECRET is set
- Restart the dev server

Database connection issues:
- Check data/ folder exists and is writable
- Verify DATABASE_URL in .env.local
- Delete data/liver_disease.db to reset

Stripe errors:
- Verify STRIPE_SECRET_KEY in .env.local
- Check test keys are active in Stripe dashboard
- Ensure network allows Stripe API calls

Redux not updating:
- Check ReduxProvider wraps your app
- Use useAppDispatch and useAppSelector hooks
- Verify Redux DevTools for state changes

Cache not working:
- Check browser localStorage is enabled
- Clear cache: CacheStorage.clear()
- Check browser console for errors

=== SECURITY NOTES ===

1. Never commit .env.local to git
2. Change JWT_SECRET in production
3. Use HTTPS in production
4. Implement rate limiting for APIs
5. Validate all user inputs (Zod schemas in place)
6. Use HTTPS for Stripe payments
7. Implement CORS if needed
8. Keep dependencies updated

=== TESTING CREDENTIALS ===

Patient Test Account:
- Email: patient@test.com
- Password: password123

Doctor Test Account:
- Email: doctor@test.com
- Password: password123

Admin Test Account:
- Email: admin@test.com
- Password: password123

(Create these manually or add seed data)

=== NEXT STEPS ===

1. Update JWT_SECRET with a secure random key
2. Add real Stripe keys when ready for production
3. Implement email notifications
4. Add more health assessment parameters
5. Connect to real ML API for predictions
6. Deploy to Vercel with environment variables
