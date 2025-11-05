#!/bin/bash

# Health check script for Docker containers

echo "🔍 Performing health checks..."

# Check backend
if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is unhealthy"
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is unhealthy"
    exit 1
fi

# Check database
if docker-compose exec db pg_isready -U taskflow_user -d taskflow_db > /dev/null 2>&1; then
    echo "✅ Database is healthy"
else
    echo "❌ Database is unhealthy"
    exit 1
fi

echo "🎉 All services are healthy!"