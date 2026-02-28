#!/usr/bin/env node

/**
 * Complete Installation and Setup Script
 * Installs dependencies and initializes the application
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

function log(message) {
  console.log(`[SETUP] ${message}`);
}

function logSuccess(message) {
  console.log(`[SETUP] ✓ ${message}`);
}

function logError(message) {
  console.error(`[SETUP] ✗ ${message}`);
}

async function runCommand(command, description) {
  try {
    log(`Running: ${description}`);
    log(`Command: ${command}`);
    log(`In directory: ${projectRoot}`);
    
    // Change to project directory first
    process.chdir(projectRoot);
    
    execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
    });
    logSuccess(description);
    return true;
  } catch (error) {
    logError(`Failed: ${description}`);
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    log('Starting Liver Disease Prediction System Setup');
    log('Project root: ' + projectRoot);
    log('');

    // Step 1: Install dependencies
    log('STEP 1: Installing Dependencies');
    log('This may take a few minutes...');
    
    const installSuccess = await runCommand(
      'npm install',
      'Installing npm packages'
    );

    if (!installSuccess) {
      logError('Failed to install dependencies');
      process.exit(1);
    }

    log('');
    logSuccess('All dependencies installed successfully');
    log('');

    // Step 2: Setup Database
    log('STEP 2: Setting up Database');
    log('Initializing MySQL tables...');
    
    const dbSuccess = await runCommand(
      'npm run setup-db',
      'Initializing MySQL database'
    );

    if (dbSuccess) {
      logSuccess('Database initialized');
    } else {
      log('Note: Database setup will be retried on first server start');
    }

    log('');

    // Step 3: Build project
    log('STEP 3: Building Next.js Project');
    log('This may take a minute...');
    
    const buildSuccess = await runCommand(
      'npm run build',
      'Building Next.js production build'
    );

    if (!buildSuccess) {
      log('Warning: Build had issues, but dev server may still work');
    }

    log('');
    logSuccess('Setup Complete!');
    log('');
    log('Next steps:');
    log('1. Start development server: npm run dev');
    log('2. Open http://localhost:3000 in your browser');
    log('');
    logSuccess('Ready to run!');

  } catch (error) {
    logError('Setup failed with error:');
    logError(error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  logError('Unexpected error during setup:');
  logError(error.message);
  process.exit(1);
});
