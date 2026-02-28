# GETTING STARTED - RUN THESE COMMANDS IN ORDER

## Step 1: Install Dependencies
```bash
pnpm install
```
This installs all required packages including Next.js, React, MySQL driver, etc.

---

## Step 2: Initialize Database  
Make sure MySQL is running and accessible at `192.168.1.101:3306` with credentials:
- Username: `root`
- Password: `C0mplex`

Then run:
```bash
pnpm run setup-db
```

This will:
- Create the database `liver_deases_prediction` if it doesn't exist
- Create all 8 tables (users, doctors, health_records, predictions, appointments, payments, notifications, admin_logs)
- Set up indexes and views

---

## Step 3: Start Development Server
```bash
pnpm dev
```

This starts the Next.js dev server at `http://localhost:3000`

---

## Troubleshooting

### Error: "next: command not found"
**Cause**: Dependencies not installed
**Fix**: Run `pnpm install` first

### Error: "Cannot find module 'mysql2'"
**Cause**: Dependencies not installed or incomplete
**Fix**: Run `pnpm install` and verify mysql2 is in node_modules

### Error: "Access denied for user 'root'"
**Cause**: MySQL credentials wrong or server not running
**Fix**: Check .env.local for correct DB_HOST, DB_USERNAME, DB_PASSWORD

### Error: "ECONNREFUSED 192.168.1.101:3306"
**Cause**: MySQL server not running on that IP
**Fix**: 
1. Verify MySQL is running: `mysql -u root -p -h 192.168.1.101`
2. Update .env.local if MySQL is on different IP
3. Ensure port 3306 is accessible

### Database already exists but tables not created
**Cause**: Table creation failed previously
**Fix**: Drop database and recreate:
```bash
mysql -u root -p -h 192.168.1.101 -e "DROP DATABASE IF EXISTS liver_deases_prediction;"
pnpm run setup-db
```

---

## What Each Step Does

**pnpm install**
- Installs 60+ npm packages
- Creates node_modules folder
- Installs Next.js, React, TypeScript, Tailwind CSS, etc.

**pnpm run setup-db**
- Connects to MySQL server
- Creates database
- Executes 324-line SQL schema
- Creates 8 tables with relationships
- Sets up indexes for performance
- Verifies all tables created

**pnpm dev**  
- Starts Next.js development server with hot reload
- Compiles TypeScript files
- Watches for file changes
- Opens http://localhost:3000 automatically

---

## Project Structure

```
/app
  /api              - Backend API routes
  /auth             - Authentication pages (login/signup)
  /dashboard        - User dashboards (patient/doctor/admin)
  
/lib
  /db-mysql.ts      - Database connection
  /auth.ts          - JWT & password utilities
  /redux-store.ts   - Redux state management

/scripts
  /setup-db.js      - Database initialization
  /create-tables.sql - Table schemas

/.env.local         - Environment variables
```

---

## Next Steps After Running

1. Go to http://localhost:3000
2. Sign up as a patient or doctor
3. Test the application features:
   - User authentication
   - Health assessment form
   - Doctor search
   - Appointment booking
   - Payment integration

---

## Need Help?

Check these files for detailed documentation:
- `MYSQL_SETUP.md` - Database setup guide
- `SETUP_AND_RUN.md` - Complete setup instructions
- `DATABASE_SCHEMA_REFERENCE.md` - Table structure
- `CONFIG_SUMMARY.md` - Configuration reference
