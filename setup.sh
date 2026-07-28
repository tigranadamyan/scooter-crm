#!/bin/bash

# Scooter CRM - Setup Script
# Usage: ./setup.sh

set -e

echo "=== Scooter CRM Setup ==="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Start containers
echo "[1/5] Starting Docker containers..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "[2/5] Waiting for PostgreSQL..."
sleep 5

# Install dependencies
echo "[3/5] Installing dependencies..."
docker compose exec php composer install
docker compose exec php npm install

# Setup environment
echo "[4/5] Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    docker compose exec php php artisan key:generate
fi

# Run migrations and seed
echo "[5/5] Running migrations and seeding database..."
docker compose exec php php artisan migrate --seed

# Build frontend
echo "[6/6] Building frontend..."
docker compose exec php npm run build

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:8888"
echo "  API:      http://localhost:8888/api"
echo ""
echo "Test accounts:"
echo "  Admin:     admin@scooter-crm.test / password"
echo "  Operator:  operator@scooter-crm.test / password"
echo "  Manager:   manager@scooter-crm.test / password"
echo "  User:      user@test.com / password"
