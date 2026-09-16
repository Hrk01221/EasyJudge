# My Project API

A FastAPI backend with user auth and blog management.

## Features
- JWT authentication
- User registration/login
- Blog CRUD

## Setup

```bash
# Clone and enter project
git clone https://github.com/you/my-project.git
cd my-project

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# edit .env with your DB credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

## API Docs
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure
```
app/
├── api/        # routes (controllers)
├── core/       # config, security, logging
├── db/         # database session/base
├── models/     # SQLAlchemy models
├── schemas/    # Pydantic schemas
├── services/   # business logic
└── utils/      # helpers
```

## Running Tests
```bash
pytest
```