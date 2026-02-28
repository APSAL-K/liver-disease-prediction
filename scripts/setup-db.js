#!/usr/bin/env node

/**
 * Database Setup Script
 * Initializes MySQL database tables for Liver Disease Prediction System
 * 
 * Usage: node scripts/setup-db.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const DB_CONFIG = {
  host: process.env.DB_HOST || '192.168.1.101',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'C0mplex',
  database: process.env.DB_DATABASE || 'liver_deases_prediction',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function setupDatabase() {
  let connection;
  try {
    console.log('[DB Setup] Connecting to MySQL...');
    console.log(`[DB Setup] Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    console.log(`[DB Setup] Database: ${DB_CONFIG.database}`);

    // Create connection without database first
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    console.log('[DB Setup] ✓ Connected to MySQL');

    // Create database if not exists
    console.log('[DB Setup] Creating database if not exists...');
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log('[DB Setup] ✓ Database created/verified');

    // Close connection and reconnect to the database
    await connection.end();

    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
    });

    console.log('[DB Setup] ✓ Connected to database');

    // Read and execute SQL file
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFilePath}`);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    const sqlStatements = sqlContent
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`[DB Setup] Found ${sqlStatements.length} SQL statements`);

    let executedCount = 0;
    let skippedCount = 0;

    for (const statement of sqlStatements) {
      try {
        // Skip comments
        if (statement.startsWith('--')) continue;

        // Skip empty statements
        if (!statement.trim()) continue;

        console.log(`[DB Setup] Executing: ${statement.substring(0, 80)}...`);
        await connection.query(statement);
        executedCount++;
      } catch (error) {
        // Ignore duplicate table and view errors
        if (
          error.code === 'ER_TABLE_EXISTS_ERROR' ||
          error.code === 'ER_VIEW_CREATE_FAILED' ||
          error.message.includes('already exists')
        ) {
          skippedCount++;
          console.log(
            `[DB Setup] ⓘ Skipped (already exists): ${statement.substring(0, 80)}...`
          );
        } else {
          console.error(`[DB Setup] ✗ Error executing statement:`, error.message);
          throw error;
        }
      }
    }

    console.log('[DB Setup] ✓ Database setup completed!');
    console.log(`[DB Setup] Executed: ${executedCount} statements`);
    console.log(`[DB Setup] Skipped: ${skippedCount} statements (already exist)`);

    // Verify tables
    console.log('[DB Setup] Verifying tables...');
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [DB_CONFIG.database]
    );

    const expectedTables = [
      'users',
      'doctors',
      'health_records',
      'predictions',
      'appointments',
      'payments',
      'notifications',
      'admin_logs',
    ];

    const createdTables = tables.map((t) => t.TABLE_NAME);
    const allTablesCreated = expectedTables.every((table) =>
      createdTables.includes(table)
    );

    if (allTablesCreated) {
      console.log('[DB Setup] ✓ All tables verified successfully!');
      console.log('[DB Setup] Tables created:');
      createdTables.forEach((table) => console.log(`  - ${table}`));
    } else {
      const missing = expectedTables.filter((t) => !createdTables.includes(t));
      throw new Error(`Missing tables: ${missing.join(', ')}`);
    }

    console.log('[DB Setup] ✓ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('[DB Setup] ✗ Fatal error:', error.message);
    if (error.code) console.error('[DB Setup] Error code:', error.code);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase().catch((err) => {
  console.error('[DB Setup] Uncaught error:', err);
  process.exit(1);
});
