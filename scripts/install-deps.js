#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectRoot = '/vercel/share/v0-project';

console.log('[INSTALL] Starting npm install...');
console.log(`[INSTALL] Project: ${projectRoot}\n`);

try {
  process.chdir(projectRoot);
  
  console.log('[INSTALL] Running: npm install');
  execSync('npm install', {
    stdio: 'inherit',
    shell: true,
  });
  
  console.log('\n[INSTALL] ✓ npm install completed successfully');
  process.exit(0);
} catch (error) {
  console.error('[INSTALL] ✗ npm install failed');
  console.error('[INSTALL] Error:', error.message);
  process.exit(1);
}
