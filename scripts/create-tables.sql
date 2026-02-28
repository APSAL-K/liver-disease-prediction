-- Liver Disease Prediction System - MySQL Database Schema
-- Database: liver_deases_prediction
-- Created: 2026

-- ===================================
-- USERS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'User email address',
  password VARCHAR(255) NOT NULL COMMENT 'Bcryptjs hashed password',
  fullName VARCHAR(255) NOT NULL COMMENT 'User full name',
  role ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient' COMMENT 'User role',
  phone VARCHAR(20) COMMENT 'Phone number',
  address VARCHAR(500) COMMENT 'User address',
  city VARCHAR(100) COMMENT 'City',
  state VARCHAR(100) COMMENT 'State/Province',
  zipCode VARCHAR(20) COMMENT 'Postal code',
  profileImage VARCHAR(500) COMMENT 'Profile image URL',
  isActive BOOLEAN DEFAULT TRUE COMMENT 'Account active status',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation date',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Main users table for patients, doctors, and admins';

-- ===================================
-- DOCTORS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  userId VARCHAR(36) NOT NULL UNIQUE COMMENT 'Foreign key to users table',
  specialization VARCHAR(255) NOT NULL COMMENT 'Medical specialization',
  qualifications VARCHAR(500) COMMENT 'Medical degrees and certifications',
  licenseNumber VARCHAR(100) NOT NULL UNIQUE COMMENT 'Medical license number',
  yearsOfExperience INT DEFAULT 0 COMMENT 'Years of medical practice',
  clinicName VARCHAR(255) COMMENT 'Clinic or hospital name',
  clinicAddress VARCHAR(500) COMMENT 'Clinic full address',
  clinicPhone VARCHAR(20) COMMENT 'Clinic phone number',
  consultationFee DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Consultation fee in USD',
  rating DECIMAL(3, 2) DEFAULT 0.00 COMMENT 'Doctor rating (0-5)',
  totalReviews INT DEFAULT 0 COMMENT 'Total number of reviews',
  availableDays VARCHAR(100) COMMENT 'Available days (JSON or CSV)',
  availableHours VARCHAR(100) COMMENT 'Available hours (JSON or CSV)',
  bio TEXT COMMENT 'Doctor biography',
  profileImage VARCHAR(500) COMMENT 'Doctor profile image URL',
  isVerified BOOLEAN DEFAULT FALSE COMMENT 'License verification status',
  isAvailable BOOLEAN DEFAULT TRUE COMMENT 'Currently accepting patients',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation date',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_specialization (specialization),
  INDEX idx_rating (rating),
  INDEX idx_isVerified (isVerified),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Doctor profiles with specialization and availability';

-- ===================================
-- HEALTH_RECORDS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS health_records (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  userId VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
  age INT COMMENT 'Patient age in years',
  sex ENUM('Male', 'Female', 'Other') COMMENT 'Patient sex',
  alcohol INT COMMENT 'Alcohol consumption level (0-10)',
  bilirubin DECIMAL(10, 4) COMMENT 'Total bilirubin level (mg/dL)',
  alkalinePhosphatase INT COMMENT 'Alkaline phosphatase level (U/L)',
  sgpt INT COMMENT 'SGPT/ALT level (U/L)',
  sgot INT COMMENT 'SGOT/AST level (U/L)',
  totalProtein DECIMAL(10, 4) COMMENT 'Total protein level (g/dL)',
  albumin DECIMAL(10, 4) COMMENT 'Albumin level (g/dL)',
  ratioCorrectedCalcium DECIMAL(10, 4) COMMENT 'Corrected calcium ratio',
  additionalNotes TEXT COMMENT 'Additional medical notes',
  labTestDate DATE COMMENT 'Date of lab tests',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation date',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_testDate (labTestDate),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Health records with lab test results';

-- ===================================
-- PREDICTIONS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS predictions (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  userId VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
  healthRecordId VARCHAR(36) COMMENT 'Foreign key to health_records table',
  riskScore INT COMMENT 'Risk score (0-100)',
  riskLevel ENUM('None', 'Low', 'Medium', 'High') DEFAULT 'None' COMMENT 'Risk level classification',
  recommendation TEXT COMMENT 'Medical recommendations (JSON or text)',
  confidence DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Prediction confidence (0-100)',
  modelVersion VARCHAR(50) COMMENT 'AI model version used',
  notes TEXT COMMENT 'Additional prediction notes',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Prediction creation date',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (healthRecordId) REFERENCES health_records(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_riskLevel (riskLevel),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='AI predictions for liver disease risk';

-- ===================================
-- APPOINTMENTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  patientId VARCHAR(36) NOT NULL COMMENT 'Foreign key to patient user',
  doctorId VARCHAR(36) NOT NULL COMMENT 'Foreign key to doctor user',
  predictionId VARCHAR(36) COMMENT 'Foreign key to predictions table',
  appointmentDate DATE NOT NULL COMMENT 'Appointment date',
  appointmentTime TIME NOT NULL COMMENT 'Appointment time',
  duration INT DEFAULT 30 COMMENT 'Appointment duration in minutes',
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled' COMMENT 'Appointment status',
  reason TEXT COMMENT 'Reason for appointment',
  notes TEXT COMMENT 'Doctor notes after appointment',
  meetingLink VARCHAR(500) COMMENT 'Video call meeting link if online',
  consultationType ENUM('in-person', 'online', 'phone') DEFAULT 'in-person' COMMENT 'Type of consultation',
  fee DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Consultation fee',
  isPaid BOOLEAN DEFAULT FALSE COMMENT 'Payment status',
  paymentId VARCHAR(100) COMMENT 'Stripe payment ID',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Appointment creation date',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
  
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (predictionId) REFERENCES predictions(id) ON DELETE SET NULL,
  INDEX idx_patientId (patientId),
  INDEX idx_doctorId (doctorId),
  INDEX idx_appointmentDate (appointmentDate),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Doctor-patient appointment bookings';

-- ===================================
-- PAYMENTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  appointmentId VARCHAR(36) COMMENT 'Foreign key to appointments table',
  userId VARCHAR(36) NOT NULL COMMENT 'Foreign key to user (payer)',
  doctorId VARCHAR(36) COMMENT 'Foreign key to doctor (recipient)',
  amount DECIMAL(10, 2) NOT NULL COMMENT 'Payment amount in USD',
  currency VARCHAR(3) DEFAULT 'USD' COMMENT 'Payment currency code',
  paymentMethod VARCHAR(50) COMMENT 'Payment method (stripe, credit_card, etc)',
  stripePaymentIntentId VARCHAR(100) UNIQUE COMMENT 'Stripe payment intent ID',
  transactionId VARCHAR(100) UNIQUE COMMENT 'Transaction ID for reference',
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending' COMMENT 'Payment status',
  refundAmount DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Refunded amount if any',
  failureReason VARCHAR(500) COMMENT 'Reason if payment failed',
  metadata JSON COMMENT 'Additional payment metadata',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Payment creation date',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_doctorId (doctorId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  INDEX idx_stripePaymentIntentId (stripePaymentIntentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Payment transactions for appointments';

-- ===================================
-- NOTIFICATIONS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  userId VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
  type VARCHAR(50) COMMENT 'Notification type (appointment, payment, etc)',
  title VARCHAR(255) NOT NULL COMMENT 'Notification title',
  message TEXT NOT NULL COMMENT 'Notification message',
  relatedId VARCHAR(36) COMMENT 'ID of related entity (appointment, payment, etc)',
  isRead BOOLEAN DEFAULT FALSE COMMENT 'Read status',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation date',
  expiresAt TIMESTAMP NULL COMMENT 'Expiry date for auto-cleanup',
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_isRead (isRead),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User notifications';

-- ===================================
-- ADMIN_LOGS TABLE (Optional - for audit trail)
-- ===================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  adminId VARCHAR(36) NOT NULL COMMENT 'Foreign key to admin user',
  action VARCHAR(100) NOT NULL COMMENT 'Action performed',
  entityType VARCHAR(50) COMMENT 'Type of entity modified',
  entityId VARCHAR(36) COMMENT 'ID of entity modified',
  oldValues JSON COMMENT 'Old values before change',
  newValues JSON COMMENT 'New values after change',
  details TEXT COMMENT 'Additional details',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Action timestamp',
  
  FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_adminId (adminId),
  INDEX idx_action (action),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Admin action audit trail';

-- ===================================
-- CREATE INDEXES FOR COMMON QUERIES
-- ===================================
CREATE INDEX idx_users_email_password ON users(email, password);
CREATE INDEX idx_appointments_datetime ON appointments(appointmentDate, appointmentTime);
CREATE INDEX idx_predictions_risk ON predictions(userId, riskLevel);
CREATE INDEX idx_payments_user_date ON payments(userId, createdAt);
CREATE INDEX idx_notifications_user_read ON notifications(userId, isRead);

-- ===================================
-- INITIAL DATA SEED (Optional Demo Data)
-- ===================================

-- Insert admin user
INSERT IGNORE INTO users (id, email, password, fullName, role, isActive) 
VALUES (
  'admin-001',
  'admin@liver-prediction.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin User',
  'admin',
  TRUE
);

-- Insert sample doctor
INSERT IGNORE INTO users (id, email, password, fullName, role, isActive, phone) 
VALUES (
  'doctor-001',
  'doctor@liver-prediction.com',
  '$2a$10$YourHashedPasswordHere',
  'Dr. John Smith',
  'doctor',
  TRUE,
  '+1-555-0101'
);

-- Insert sample patient
INSERT IGNORE INTO users (id, email, password, fullName, role, isActive) 
VALUES (
  'patient-001',
  'patient@liver-prediction.com',
  '$2a$10$YourHashedPasswordHere',
  'Jane Doe',
  'patient',
  TRUE
);

-- Insert doctor profile
INSERT IGNORE INTO doctors (
  id, userId, specialization, qualifications, licenseNumber, 
  yearsOfExperience, clinicName, consultationFee, isVerified, isAvailable
) 
VALUES (
  'doctor-profile-001',
  'doctor-001',
  'Hepatology',
  'MD, Board Certified in Hepatology',
  'MD123456',
  10,
  'City Medical Clinic',
  99.99,
  TRUE,
  TRUE
);

-- ===================================
-- VIEWS (Optional - for common queries)
-- ===================================
CREATE OR REPLACE VIEW high_risk_patients AS
SELECT 
  u.id,
  u.fullName,
  u.email,
  p.riskLevel,
  p.riskScore,
  p.createdAt,
  MAX(p.createdAt) as latestPredictionDate
FROM users u
JOIN predictions p ON u.id = p.userId
WHERE p.riskLevel IN ('High', 'Medium')
GROUP BY u.id, p.riskLevel, p.riskScore
ORDER BY p.riskScore DESC;

CREATE OR REPLACE VIEW doctor_statistics AS
SELECT 
  d.id,
  d.userId,
  u.fullName,
  d.specialization,
  COUNT(DISTINCT a.id) as totalAppointments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completedAppointments,
  SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as totalEarnings,
  AVG(d.rating) as averageRating
FROM doctors d
JOIN users u ON d.userId = u.id
LEFT JOIN appointments a ON d.userId = a.doctorId
LEFT JOIN payments p ON a.id = p.appointmentId
GROUP BY d.id, d.userId;

-- ===================================
-- DATABASE CHARSET
-- ===================================
ALTER DATABASE liver_deases_prediction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
