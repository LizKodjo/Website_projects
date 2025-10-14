# URL Shortener

A full-stack URL shortener web application built with Python Flask, SQLAlchemy, and Bootstrap. Create short, memorable links for long URLs and track their usage statistics.

## Features

- 🔗 **URL Shortening**: Convert long URLs into short, shareable links
- 📊 **Click Analytics**: Track total clicks and last access time for each shortened URL
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 📋 **Copy to Clipboard**: One-click copying of shortened URLs
- 📈 **Statistics Dashboard**: View detailed stats for individual URLs and all URLs
- 🚀 **Fast Redirects**: Instant redirection from short codes to original URLs
- ✅ **Input Validation**: Automatic protocol addition and URL validation

## Tech Stack

### Backend

- **Python 3.8+**
- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)

### Frontend

- **HTML5/CSS3/JavaScript**
- **Bootstrap 5** - Responsive UI framework
- **Jinja2** - Template engine

### Testing

- **pytest** - Testing framework
- **pytest-flask** - Flask testing utilities

## Project Structure

urlshortener/

├── app.py # Main Flask application
├── models.py # Database models
├── requirements.txt # Python dependencies
├── pytest.ini # pytest configuration
├── run_tests.py # Test runner script
├── README.md # Project documentation
├── tests/ # Test suite
│ ├── init.py
│ ├── conftest.py
│ ├── test_models.py
│ ├── test_routes.py
│ ├── test_utils.py
│ └── test_integration.py
├── templates/ # HTML templates
│ ├── base.html
│ ├── index.html
│ ├── stats.html
│ └── all_stats.html
└── static/ # Static assets
├── css/
│ └── style.css
└── js/
└── script.js

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd url_shortener

# Or simply download and extract the project files
```

### Step 2: Create Virtual Environment (Recommended)

```bash

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

```

### Step 3: Install Dependencies

```bash

pip install -r requirements.txt

```

### Step 4: Run the Application

```bash

python app.py

```

The application will be available at http://localhost:5000

## Usage

### Shortening a URL

- Visit the home page at http://localhost:5000

- Enter your long URL in the input field

- Click "Shorten URL"

- Copy your shortened URL using the "Copy" button

### Accessing Statistics

- Individual URL Stats: Click "View Stats" next to any shortened URL

- All URLs: Navigate to "All URLs" in the navigation bar

### Using Short URLs

Simply visit http://localhost:5000/{short-code} to be redirected to the original URL. Click tracking happens automatically.

### Testing

The project includes a comprehensive test suite:

## Run All Tests

```bash

python run_tests.py

```

## Or Use pytest Directly

```bash

python -m pytest tests/ -v

```

## Run Specific Test Categories

```bash

# Model tests only
python -m pytest tests/test_models.py -v

# Route tests only
python -m pytest tests/test_routes.py -v

# Utility tests only
python -m pytest tests/test_utils.py -v

# Integration tests only
python -m pytest tests/test_integration.py -v

```

## Test Coverage

The test suite covers:

- Database models and relationships

- URL shortening logic

- Redirect functionality

- Click tracking

- Statistics pages

- Error handling

- Complete user workflows

## Configuration

### Environment Variables

The application can be configured using environment variables:

```bash

export FLASK_ENV=production
export DATABASE_URL=sqlite:///app.db
export SECRET_KEY=your-secret-key-here

```

## Database

By default, the application uses SQLite. To use PostgreSQL or MySQL:

1. Update `app.py`:

```bash

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/dbname'

```

2.  Install the appropriate database driver:

```bash

# For PostgreSQL
pip install psycopg2-binary

# For MySQL
pip install mysqlclient

```
