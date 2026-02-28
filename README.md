# Liver Disease Prediction System

A comprehensive full-stack application for AI-powered liver disease prediction, doctor consultations, and appointment management.

## Features

- **AI Health Assessment**: ML-powered liver disease risk prediction based on health parameters
- **Doctor Discovery**: Browse and search verified healthcare professionals
- **Appointment Booking**: Schedule consultations with specialists
- **Payment Processing**: Integrated Stripe payment system for consultations
- **Multi-Role Dashboards**: Patient, doctor, and admin dashboards with role-based features
- **Real-time Notifications**: Appointment reminders and updates
- **Secure Authentication**: JWT-based authentication with MongoDB

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with bcryptjs
- **Payments**: Stripe integration
- **Charts**: Recharts for analytics
- **UI Components**: shadcn/ui component library

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXT_PUBLIC_STRIPE_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ML_API_URL=http://localhost:5000/predict (optional for ML predictions)
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── api/                      # API routes for backend logic
│   ├── auth/               # Authentication endpoints
│   ├── predictions/        # ML prediction endpoints
│   ├── doctors/            # Doctor management endpoints
│   ├── appointments/       # Appointment booking endpoints
│   └── payments/           # Payment processing endpoints
├── auth/                     # Authentication pages (login, signup)
├── dashboard/               # Main dashboard with role-based routing
│   ├── patient/            # Patient-specific pages
│   ├── doctor/             # Doctor-specific pages
│   └── admin/              # Admin management pages
└── page.tsx                # Landing page

lib/
├── db.ts                    # MongoDB connection
├── auth.ts                  # JWT utilities
├── validators.ts            # Input validation schemas
├── api.ts                   # API helper functions
└── models/                  # Mongoose schemas
    ├── User.ts
    ├── Doctor.ts
    ├── Patient.ts
    ├── Appointment.ts
    ├── Prediction.ts
    └── Payment.ts

components/
├── ui/                      # Reusable UI components
└── dashboard-layout.tsx     # Shared dashboard layout

hooks/
├── use-auth.ts             # Authentication hook
└── use-mobile.ts           # Responsive design hook
```

## Key Features Implemented

### Authentication
- User registration with role selection (Patient/Doctor)
- Secure JWT-based login
- Password hashing with bcryptjs
- Protected API routes

### Patient Features
- Health assessment form submission
- AI-powered risk prediction
- Doctor discovery and filtering
- Appointment booking system
- Payment processing
- Health records viewing

### Doctor Features
- Profile management
- Patient list viewing
- Appointment scheduling and confirmation
- Income tracking

### Admin Features
- System-wide statistics
- User management
- Doctor verification
- Payment oversight

## API Endpoints

### Authentication
- `POST /api/auth` - Register/Login

### Predictions
- `GET /api/predictions` - Get user predictions
- `POST /api/predictions` - Create new prediction

### Doctors
- `GET /api/doctors` - Browse doctors
- `POST /api/doctors` - Update doctor profile

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Book appointment
- `PATCH /api/appointments` - Update appointment status

### Payments
- `POST /api/payments` - Create payment intent
- `PATCH /api/payments` - Update payment status
- `GET /api/payments` - Get payment history

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe public key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `ML_API_URL` | Python ML API endpoint (optional) |

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS protection
- Input validation with Zod schemas
- Protected API routes with auth verification
- Secure HTTP-only cookies (ready for implementation)
- Role-based access control

## Testing the Application

1. **Create Patient Account**: Sign up as a patient
2. **Take Health Assessment**: Submit health parameters
3. **View Results**: Check your risk assessment results
4. **Browse Doctors**: Find specialists by specialty
5. **Book Appointment**: Schedule a consultation
6. **Make Payment**: Complete payment for appointment

## Database Models

### User
- Basic user information
- Role (patient/doctor/admin)
- Password hash
- Profile data

### Doctor
- Medical credentials
- Specialty information
- Clinic details
- Rating and reviews

### Appointment
- Patient and doctor references
- Appointment details
- Status tracking
- Notes and reason for visit

### Prediction
- Health assessment parameters
- Risk score and level
- Recommendations
- Timestamp

### Payment
- Appointment reference
- Amount and status
- Stripe payment intent ID
- Timestamps

## Future Enhancements

- Real-time notifications with WebSockets
- Video consultation integration
- Medical records PDF export
- Advanced analytics dashboard
- Insurance integration
- Multi-language support
- Mobile application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub or contact support.
