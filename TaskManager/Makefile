.PHONY: help build up down logs clean test lint

help:
	@echo "TaskFlow Pro - Development Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build      Build all services"
	@echo "  make up         Start all services"
	@echo "  make down       Stop all services"
	@echo "  make dev        Start development environment"
	@echo "  make logs       View service logs"
	@echo "  make clean      Remove all containers and volumes"
	@echo "  make test       Run tests"
	@echo "  make lint       Run linting"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

dev:
	docker-compose -f docker-compose.dev.yml up

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

test-backend:
	cd backend && python -m pytest

test-frontend:
	cd frontend && npm test

lint-backend:
	cd backend && flake8 app tests

lint-frontend:
	cd frontend && npm run lint

test: test-backend test-frontend
lint: lint-backend lint-frontend

# Database operations
db-shell:
	docker-compose exec db psql -U taskflow_user -d taskflow_db

db-backup:
	docker-compose exec db pg_dump -U taskflow_user taskflow_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Production setup
prod-build:
	docker-compose -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d