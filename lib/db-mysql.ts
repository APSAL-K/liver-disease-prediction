'use server';

import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export async function getDbConnection() {
  if (connection) {
    return connection;
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'liver_disease_prediction',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('[v0] MySQL connection established');
    return connection;
  } catch (error) {
    console.error('[v0] Database connection failed:', error);
    throw new Error('Database connection failed');
  }
}

export async function initializeDatabase() {
  const conn = await getDbConnection();

  try {
    // Create users table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255),
        role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create doctors table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS doctors (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) UNIQUE NOT NULL,
        specialty VARCHAR(255),
        qualifications TEXT,
        experience INT,
        clinicName VARCHAR(255),
        clinicAddress TEXT,
        phone VARCHAR(20),
        rating DECIMAL(3,2) DEFAULT 0,
        consultationFee DECIMAL(10,2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create health_records table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS health_records (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        age INT,
        sex VARCHAR(10),
        alcohol INT,
        bilirubin DECIMAL(10,2),
        alkalinePhosphatase DECIMAL(10,2),
        sgpt DECIMAL(10,2),
        sgot DECIMAL(10,2),
        totalProtein DECIMAL(10,2),
        albumin DECIMAL(10,2),
        ratioCorrectedCalcium DECIMAL(10,2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create predictions table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS predictions (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        healthRecordId VARCHAR(36),
        riskScore DECIMAL(5,2),
        riskLevel VARCHAR(20),
        recommendation TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (healthRecordId) REFERENCES health_records(id) ON DELETE CASCADE
      )
    `);

    // Create appointments table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(36) PRIMARY KEY,
        patientId VARCHAR(36) NOT NULL,
        doctorId VARCHAR(36) NOT NULL,
        appointmentDate DATETIME,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    // Create payments table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        appointmentId VARCHAR(36) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        doctorId VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2),
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        stripePaymentIntentId VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    console.log('[v0] Database tables initialized successfully');
  } catch (error) {
    console.error('[v0] Database initialization error:', error);
    throw error;
  }
}

// Initialize database on server start
initializeDatabase().catch(console.error);
