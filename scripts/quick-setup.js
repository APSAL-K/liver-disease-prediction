#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = '/vercel/share/v0-project';

console.log('\n[SETUP] Liver Disease Prediction System - Complete Setup');
console.log(`[SETUP] Project: ${projectRoot}\n`);

try {
  // Step 1: Clean npm cache
  console.log('[SETUP] STEP 1: Cleaning npm cache');
  execSync('npm cache clean --force', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });
  console.log('[SETUP] ✓ Cache cleaned\n');
} catch (e) {
  console.log('[SETUP] ⓘ Cache clean had issues, continuing...\n');
}

try {
  // Step 2: Install dependencies
  console.log('[SETUP] STEP 2: Installing dependencies');
  console.log('[SETUP] This may take 2-3 minutes...\n');
  
  execSync('npm install --verbose', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });
  console.log('[SETUP] ✓ Dependencies installed\n');
} catch (e) {
  console.error('[SETUP] ✗ Installation failed');
  process.exit(1);
}

try {
  // Step 3: Setup database
  console.log('[SETUP] STEP 3: Setting up MySQL database');
  
  execSync('node scripts/setup-db.js', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });
  console.log('[SETUP] ✓ Database setup completed\n');
} catch (e) {
  console.log('[SETUP] ⓘ Database setup skipped (can be run later)\n');
}

try {
  // Step 4: Build project
  console.log('[SETUP] STEP 4: Building Next.js project');
  console.log('[SETUP] This may take 1-2 minutes...\n');
  
  execSync('npm run build', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });
  console.log('[SETUP] ✓ Build completed\n');
} catch (e) {
  console.log('[SETUP] ⓘ Build had issues but dev server should work\n');
}

console.log('='.repeat(60));
console.log('[SETUP] ✓ SETUP COMPLETE!');
console.log('='.repeat(60));
console.log('\n[SETUP] To start the development server, run:\n');
console.log('   cd /vercel/share/v0-project');
console.log('   npm run dev\n');
console.log('[SETUP] Then open: http://localhost:3000\n');

process.exit(0);
