#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectDir = '/vercel/share/v0-project';

console.log('[SETUP] Starting installation...');
console.log('[SETUP] Project directory:', projectDir);

try {
  console.log('[SETUP] Running: npm install --legacy-peer-deps');
  
  // Run npm install with legacy peer deps to avoid conflicts
  execSync('npm install --legacy-peer-deps', {
    cwd: projectDir,
    stdio: 'inherit',
    shell: true
  });

  console.log('[SETUP] ✓ Installation completed successfully');
  console.log('[SETUP] Next step: Run "npm run dev" to start the server');
  
  process.exit(0);
} catch (error) {
  console.error('[SETUP] ✗ Installation failed:', error.message);
  process.exit(1);
}
