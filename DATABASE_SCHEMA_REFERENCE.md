# Database Schema Reference

## All 8 Tables with Columns

### 1. USERS Table
Stores user accounts (patients, doctors, admins)

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| email | VARCHAR(255) UNIQUE | User email |
| password | VARCHAR(255) | Bcryptjs hash |
| fullName | VARCHAR(255) | User name |
| role | ENUM | 'patient', 'doctor', 'admin' |
| phone | VARCHAR(20) | Phone number |
| address | VARCHAR(500) | Street address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State/Province |
| zipCode | VARCHAR(20) | Postal code |
| profileImage | VARCHAR(500) | Image URL |
| isActive | BOOLEAN | Account status |
| createdAt | TIMESTAMP | Created date |
| updatedAt | TIMESTAMP | Updated date |

---

### 2. DOCTORS Table
Doctor profiles with specialization

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| userId | VARCHAR(36) UNIQUE FK | Links to users.id |
| specialization | VARCHAR(255) | e.g., "Hepatology" |
| qualifications | VARCHAR(500) | Degrees/certs |
| licenseNumber | VARCHAR(100) UNIQUE | Medical license |
| yearsOfExperience | INT | Years practiced |
| clinicName | VARCHAR(255) | Clinic name |
| clinicAddress | VARCHAR(500) | Clinic address |
| clinicPhone | VARCHAR(20) | Clinic phone |
| consultationFee | DECIMAL(10,2) | Fee in USD |
| rating | DECIMAL(3,2) | 0-5 stars |
| totalReviews | INT | Review count |
| availableDays | VARCHAR(100) | Days JSON/CSV |
| availableHours | VARCHAR(100) | Hours JSON/CSV |
| bio | TEXT | Doctor biography |
| profileImage | VARCHAR(500) | Photo URL |
| isVerified | BOOLEAN | License verified |
| isAvailable | BOOLEAN | Accepting patients |
| createdAt | TIMESTAMP | Created |
| updatedAt | TIMESTAMP | Updated |

---

### 3. HEALTH_RECORDS Table
Patient lab test results

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| userId | VARCHAR(36) FK | Patient ID |
| age | INT | Age in years |
| sex | ENUM | 'Male', 'Female', 'Other' |
| alcohol | INT | Consumption (0-10) |
| bilirubin | DECIMAL(10,4) | Total bilirubin (mg/dL) |
| alkalinePhosphatase | INT | AP level (U/L) |
| sgpt | INT | SGPT/ALT (U/L) |
| sgot | INT | SGOT/AST (U/L) |
| totalProtein | DECIMAL(10,4) | Total protein (g/dL) |
| albumin | DECIMAL(10,4) | Albumin (g/dL) |
| ratioCorrectedCalcium | DECIMAL(10,4) | Corrected calcium |
| additionalNotes | TEXT | Medical notes |
| labTestDate | DATE | Test date |
| createdAt | TIMESTAMP | Record created |
| updatedAt | TIMESTAMP | Updated |

---

### 4. PREDICTIONS Table
AI risk predictions

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| userId | VARCHAR(36) FK | Patient ID |
| healthRecordId | VARCHAR(36) FK | Health record |
| riskScore | INT | 0-100 score |
| riskLevel | ENUM | 'None', 'Low', 'Medium', 'High' |
| recommendation | TEXT | Recommendations |
| confidence | DECIMAL(5,2) | 0-100 confidence |
| modelVersion | VARCHAR(50) | AI model version |
| notes | TEXT | Notes |
| createdAt | TIMESTAMP | Predicted |
| updatedAt | TIMESTAMP | Updated |

---

### 5. APPOINTMENTS Table
Doctor appointment bookings

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| patientId | VARCHAR(36) FK | Patient user ID |
| doctorId | VARCHAR(36) FK | Doctor user ID |
| predictionId | VARCHAR(36) FK | Linked prediction |
| appointmentDate | DATE | Date of appointment |
| appointmentTime | TIME | Time of appointment |
| duration | INT | Minutes (default 30) |
| status | ENUM | 'scheduled', 'confirmed', 'completed', 'cancelled' |
| reason | TEXT | Appointment reason |
| notes | TEXT | Doctor notes |
| meetingLink | VARCHAR(500) | Video call URL |
| consultationType | ENUM | 'in-person', 'online', 'phone' |
| fee | DECIMAL(10,2) | Consultation fee |
| isPaid | BOOLEAN | Payment status |
| paymentId | VARCHAR(100) | Stripe payment ID |
| createdAt | TIMESTAMP | Booked |
| updatedAt | TIMESTAMP | Updated |

---

### 6. PAYMENTS Table
Stripe payment transactions

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| appointmentId | VARCHAR(36) FK | Linked appointment |
| userId | VARCHAR(36) FK | Payer ID |
| doctorId | VARCHAR(36) FK | Recipient ID |
| amount | DECIMAL(10,2) | Amount in USD |
| currency | VARCHAR(3) | 'USD' etc |
| paymentMethod | VARCHAR(50) | 'stripe', 'card', etc |
| stripePaymentIntentId | VARCHAR(100) UNIQUE | Stripe ID |
| transactionId | VARCHAR(100) UNIQUE | TX reference |
| status | ENUM | 'pending', 'processing', 'completed', 'failed', 'refunded' |
| refundAmount | DECIMAL(10,2) | Refund amount |
| failureReason | VARCHAR(500) | Error message |
| metadata | JSON | Extra data |
| createdAt | TIMESTAMP | Created |
| updatedAt | TIMESTAMP | Updated |

---

### 7. NOTIFICATIONS Table
User notifications

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| userId | VARCHAR(36) FK | Recipient |
| type | VARCHAR(50) | 'appointment', 'payment', etc |
| title | VARCHAR(255) | Title |
| message | TEXT | Message body |
| relatedId | VARCHAR(36) | Entity ID |
| isRead | BOOLEAN | Read status |
| createdAt | TIMESTAMP | Created |
| expiresAt | TIMESTAMP | Auto-cleanup date |

---

### 8. ADMIN_LOGS Table
Audit trail

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) PRIMARY KEY | UUID |
| adminId | VARCHAR(36) FK | Admin who acted |
| action | VARCHAR(100) | Action name |
| entityType | VARCHAR(50) | Type modified |
| entityId | VARCHAR(36) | ID of entity |
| oldValues | JSON | Previous values |
| newValues | JSON | New values |
| details | TEXT | Description |
| createdAt | TIMESTAMP | When |

---

## 2 Database Views

### high_risk_patients View
Lists patients with Medium/High risk

```sql
SELECT 
  u.id, u.fullName, u.email,
  p.riskLevel, p.riskScore, p.createdAt
FROM users u
JOIN predictions p ON u.id = p.userId
WHERE p.riskLevel IN ('High', 'Medium')
ORDER BY p.riskScore DESC
```

### doctor_statistics View
Doctor performance metrics

```sql
SELECT 
  d.id, d.userId, u.fullName, d.specialization,
  COUNT(DISTINCT a.id) as totalAppointments,
  SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as totalEarnings,
  AVG(d.rating) as averageRating
FROM doctors d
JOIN users u ON d.userId = u.id
LEFT JOIN appointments a ON d.userId = a.doctorId
LEFT JOIN payments p ON a.id = p.appointmentId
GROUP BY d.id
```

---

## Key Relationships

```
users (1) ──┬─→ (1) doctors
            ├─→ (M) health_records
            ├─→ (M) predictions
            ├─→ (M) appointments (as patient)
            └─→ (M) appointments (as doctor)

health_records (1) ──→ (M) predictions
predictions (1) ──→ (M) appointments
appointments (1) ──→ (1) payments
```

---

## Indexes Created

For fast queries:
- `users(email)` - Login lookups
- `doctors(specialization, rating)` - Doctor search
- `predictions(userId, riskLevel)` - Risk analytics
- `appointments(patientId, appointmentDate, status)` - Schedule
- `payments(status, createdAt)` - Payment tracking
- `notifications(userId, isRead)` - Notifications

---

## Sample SQL Queries

### Get patient's latest prediction
```sql
SELECT * FROM predictions 
WHERE userId = 'patient-001' 
ORDER BY createdAt DESC LIMIT 1;
```

### Get doctor's upcoming appointments
```sql
SELECT a.*, u.fullName as patientName
FROM appointments a
JOIN users u ON a.patientId = u.id
WHERE a.doctorId = 'doctor-001'
  AND a.appointmentDate >= CURDATE()
  AND a.status IN ('scheduled', 'confirmed')
ORDER BY a.appointmentDate, a.appointmentTime;
```

### Get high-risk patients
```sql
SELECT * FROM high_risk_patients LIMIT 20;
```

### Get doctor earnings
```sql
SELECT 
  SUM(p.amount) as totalEarnings,
  COUNT(DISTINCT p.id) as totalPayments
FROM payments p
WHERE p.doctorId = 'doctor-001'
  AND p.status = 'completed';
```

### Get unread notifications
```sql
SELECT * FROM notifications 
WHERE userId = 'patient-001' 
  AND isRead = FALSE
ORDER BY createdAt DESC;
```

---

## Table Creation Command

To create all tables at once, run:

```bash
# Using Node script (recommended)
pnpm run setup-db

# Or directly with MySQL
mysql -h 192.168.1.101 -u root -pC0mplex liver_deases_prediction < scripts/create-tables.sql
```

---

## Column Types Reference

- `VARCHAR(255)` - Text up to 255 chars
- `TEXT` - Large text
- `INT` - Whole numbers
- `DECIMAL(10,2)` - Numbers with 2 decimals
- `DATE` - YYYY-MM-DD
- `TIME` - HH:MM:SS
- `TIMESTAMP` - Date + Time
- `ENUM` - Fixed options
- `BOOLEAN` - True/False
- `JSON` - JSON objects

---

## Stats After Creation

- **8 Tables** with proper relationships
- **50+ Columns** across all tables
- **15+ Indexes** for performance
- **2 Views** for analytics
- **Foreign Keys** maintaining data integrity
- **UTF-8** encoding for international support

Ready to use! Run `pnpm run setup-db` to initialize.
