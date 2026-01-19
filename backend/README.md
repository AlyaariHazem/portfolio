# Portfolio Contact API - Django Backend

Django REST API for handling contact form submissions from the Angular portfolio website.

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` and add:
- `SECRET_KEY`: Generate a Django secret key
- `EMAIL_HOST_USER`: Your email address
- `EMAIL_HOST_PASSWORD`: Your email app password (for Gmail, use App Password)

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/contact/`

## API Endpoint

### POST /api/contact/

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "This is a test message"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! I'll get back to you soon."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": {
    "email": ["Enter a valid email address."]
  },
  "message": "Please check the form and try again."
}
```

## Production Deployment

For production, consider:
- Using PostgreSQL instead of SQLite
- Setting up proper CORS origins
- Using environment variables for sensitive data
- Setting up proper email service (SendGrid, AWS SES, etc.)
- Using Gunicorn or uWSGI as WSGI server
- Setting up Nginx as reverse proxy
