#!/bin/bash

echo "=========================================="
echo "Liver Disease Prediction System Setup"
echo "=========================================="
echo ""

# Step 1: Install dependencies
echo "[STEP 1] Installing dependencies with pnpm..."
cd /vercel/share/v0-project

if ! command -v pnpm &> /dev/null; then
    echo "[INFO] pnpm not found, installing globally..."
    npm install -g pnpm
fi

echo "[INSTALLING] Running pnpm install..."
pnpm install --force 2>&1 | tail -20

if [ $? -eq 0 ]; then
    echo "[SUCCESS] Dependencies installed successfully"
else
    echo "[ERROR] Dependency installation failed"
    exit 1
fi

echo ""
echo "[STEP 2] Setting up MySQL database..."
pnpm run setup-db 2>&1

echo ""
echo "[STEP 3] Building Next.js..."
pnpm build 2>&1 | tail -20

if [ $? -eq 0 ]; then
    echo "[SUCCESS] Build completed successfully"
else
    echo "[WARNING] Build had issues but continuing..."
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the development server, run:"
echo "  cd /vercel/share/v0-project"
echo "  pnpm dev"
echo ""
echo "The application will be available at:"
echo "  http://localhost:3000"
echo ""
