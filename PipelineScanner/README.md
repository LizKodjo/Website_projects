# 🔒 CI/CD Security Scanner

A comprehensive security scanning tool for CI/CD pipeline configurations that identifies security misconfigurations and provides automated fixes.

## Features

- **Multi-Platform Support**: GitHub Actions, GitLab CI
- **Security Scanning**: Hardcoded secrets, permissions, outdated actions
- **Automated Fixes**: One-click fixes for common issues
- **Web Dashboard**: User-friendly interface
- **REST API**: Programmatic access
- **Docker Support**: Easy deployment

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo>
cd cicd-security-scanner

# Start services
docker-compose up --build

# Access the dashboard at http://localhost:8501
# API available at http://localhost:8000