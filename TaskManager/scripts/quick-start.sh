#!/bin/bash

echo "🚀 Starting TaskFlow Pro..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building services..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Run health check
./scripts/health-check.sh

echo "✨ TaskFlow Pro is ready!"
echo ""
echo "📊 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo "   Database: localhost:5432"
echo "   pgAdmin: http://localhost:5050"
echo ""
echo "🔧 Useful commands:"
echo "   make logs      - View logs"
echo "   make down      - Stop services"
echo "   make clean     - Clean up everything"